/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import { User } from '../users/user.model';
import mongoose from 'mongoose';
import OrderBook from './orderBooks.model';
import { TOrderBook } from './orderBooks.interface';
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

    const { product, quantity } = data;

    if (!data.customer) {
      data.customer = new mongoose.Types.ObjectId(user._id);
    }

    const book = await booksModel.findById(product).session(session);
    if (!book || book.stock < quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Insufficient stock or book not found.'
      );
    }

    data.totalPrice = book.price * quantity;
    book.stock -= quantity;
    await book.save({ session });

    const orderData = { ...data, customer: user._id };
    const result = await OrderBook.create([orderData], { session });
    await result[0].populate('customer', 'name email role');

    await session.commitTransaction();
    session.endSession();

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
      await result[0].updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      });
    }

    // Return both order and payment link
    return { order: result[0], checkout_url: payment.checkout_url };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Book order creation failed'
    );
  }
};


const getAllOrdersByUser = async (userId: string) => {
  const userOrders = await OrderBook.find({ customer: userId }).populate({
    path: 'product',
    select: 'title',
  });
  if (!userOrders || userOrders.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No orders found for this user');
  }
  return userOrders;
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

    const book = await booksModel.findById(order.product).session(session);
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
  getAllOrdersByUser,
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