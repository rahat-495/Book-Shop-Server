/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import { User } from '../users/user.model';
import mongoose from 'mongoose';
import OrderBook, { cartModel } from './orderBooks.model';
import { TCartItem, TAddToCartIntoDb, TOrderBook } from './orderBooks.interface';
import AppError from '../../errors/AppError';
import { booksModel } from '../books/books.model';
import { orderUtils } from './order.utils';

const createBookOrderService = async (
  data: TOrderBook,
  userId: string,
  client_ip: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const { id , quantity } = data;

    if (!data.customer) {
      data.customer = new mongoose.Types.ObjectId(user._id);
    }

    const book = await booksModel.findById(id).session(session);
    if (!book || book.stock < quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Insufficient stock or book not found.'
      );
    }
    
    data.totalPrice = book.price * quantity;
    book.stock -= quantity;
    await book.save({ session });
    
    const orderData = {...data, customer: user._id };
    const result = await OrderBook.create([orderData], { session });
    await result[0].populate('customer', 'name email role');

    // Payment integration
    const shurjopayPayload = {
      amount: data.totalPrice,
      order_id: result[0]._id,
      currency: 'BDT',
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: 'N/A',
      customer_address: 'N/A',
      customer_city: 'N/A',
      client_ip,
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus) {
      await cartModel.findByIdAndDelete(data?.cardId , {session}) ;
      await result[0].updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      });
    }

    await session.commitTransaction();
    session.endSession();
    // Return both order and payment link
    return { order: result[0], checkout_url: payment.checkout_url };
  } catch (error) {

    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Book order creation failed'
    );

  }
};

const verifyBookOrderPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await OrderBook.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transaction_status': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status === 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status === 'Failed'
            ? 'Pending'
            : verifiedPayment[0].bank_status === 'Cancel'
            ? 'Cancelled'
            : '',
      }
    );
  }

  return verifiedPayment;
};

const getAllOrdersByUser = async (userId: string) => {
  const userOrders = await OrderBook.find({ customer: userId }).populate({
    path: 'product customer',
  });
  if (!userOrders || userOrders.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No orders found for this user');
  }
  return userOrders;
};

const getCartItem = async (email : string) => {
  const products = await cartModel.find({ email : email.slice(6) }).populate("product");
  return products ;
};

const addToCartIntoDb = async (payload : TAddToCartIntoDb) => {
  const isUserAxist = await User.findOne({ email : payload.email }) ;
  if(!isUserAxist){
    throw new AppError(404 , "User not found !") ;
  }

  const isProductAxist = await booksModel.findById(payload.product) ;
  if(!isProductAxist){
    throw new AppError(404 , "Book not found !") ;
  }

  const craeteCart = await cartModel.create(payload) ;
  const result = await cartModel.findById(craeteCart._id).populate("product")
  return result ;
};

const updateOrderQuantityService = async (
  orderId: string,
  userId: string,
  newQuantity: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderBook.findById(orderId).session(session);
    if (!order) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
    }

    if (order.customer.toString() !== userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Unauthorized to update this order'
      );
    }

    const book = await booksModel.findById(order.id).session(session);
    if (!book) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Book not found');
    }

    const quantityDifference = newQuantity - order.quantity;

    if (quantityDifference > 0 && book.stock < quantityDifference) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Not enough stock available');
    }

    // Update book stock
    book.stock -= quantityDifference;
    await book.save({ session });

    // Update order quantity and total price
    order.quantity = newQuantity;
    order.totalPrice = book.price * newQuantity;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteOrderFromDB = async (id: string, userId: string) => {
  const order = await OrderBook.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  if (order.customer.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Unauthorized to delete this order'
    );
  }
  return await OrderBook.findByIdAndDelete(id);
};

const adminDeleteOrder = async (id: string) => {
  const order = await OrderBook.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  return await OrderBook.findByIdAndDelete(id);
};

export const orderBookService = {
  createBookOrderService,
  verifyBookOrderPayment,
  getAllOrdersByUser,
  addToCartIntoDb ,
  getCartItem,
  updateOrderQuantityService,
  deleteOrderFromDB,
  adminDeleteOrder,
};

// old order create code=====================
// const createBookOrderService = async (data: TOrderBook, userId: string) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const user = await User.findById(userId).session(session);
//     if (!user) {
//       throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
//     }

//     const { product, quantity } = data;

//     if (!data.customer) {
//       data.customer = new mongoose.Types.ObjectId(user._id);
//     }

//     const book = await booksModel.findById(product).session(session);
//     if (!book || book.stock < quantity) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Insufficient stock or book not found.'
//       );
//     }

//     data.totalPrice = book.price * quantity;
//     book.stock -= quantity;
//     await book.save({ session });

//     const orderData = { ...data, customer: user._id };
//     const result = await OrderBook.create([orderData], { session });
//     await result[0].populate('customer', 'name email role');

//     await session.commitTransaction();
//     session.endSession();

//     return result[0];
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new AppError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Book order creation failed'
//     );
//   }
// };
