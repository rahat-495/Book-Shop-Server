import { Request, Response } from 'express';
import { orderBookService } from './orderBooks.service';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import sendResponse from '../../utils/sendResponse';

const createBookOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User Not Authenticated');
  }
  
  const { product, quantity } = req.body;
  
  if (!product && !quantity) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Product and quantity are required.'
    );
  }

  const bookOrderData = {
    ...req.body,
    user: userId,
  };

  const client_ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const result = await orderBookService.createBookOrderService(
    bookOrderData,
    userId,
    client_ip
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Book order created successfully',
    data: result,
  });
});

const verifyBookOrder = catchAsync(async (req: Request, res: Response) => {
  const { order_id } = req.query;

  if (!order_id || typeof order_id !== 'string') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid order_id');
  }

  const result = await orderBookService.verifyBookOrderPayment(order_id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment verification successful',
    data: result,
  });
});

const getUserBookOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const result = await orderBookService.getAllOrdersByUser(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getCartItem = catchAsync(async (req: Request, res: Response) => {
  const result = await orderBookService.getCartItem(req.params?.email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Carts retrieved successfully',
    data: result,
  });
});

const updateBookOrderQuantity = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { orderId } = req.params;
    const { newQuantity } = req.body;

    if (!newQuantity || newQuantity <= 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid quantity provided');
    }

    const updatedOrder = await orderBookService.updateOrderQuantityService(
      orderId,
      userId,
      newQuantity
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Book order quantity updated successfully',
      data: updatedOrder,
    });
  }
);

const deleteBookOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user?._id;

  await orderBookService.deleteOrderFromDB(orderId, userId);

  sendResponse(res, { data : {} ,
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book order deleted successfully',
  });
});

const adminDeleteBookOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await orderBookService.adminDeleteOrder(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book order deleted successfully',
    data: result,
  });
});

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const result = await orderBookService.addToCartIntoDb(req.body);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Add to cart done !',
    data: result,
  });
})

export const orderBookController = {
  createBookOrder,
  addToCart ,
  verifyBookOrder,
  getUserBookOrders,
  getCartItem,
  updateBookOrderQuantity,
  deleteBookOrder,
  adminDeleteBookOrder,
};
