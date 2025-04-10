import { Request, Response } from 'express';
import { orderBookService } from './orderBooks.service';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import sendResponse from '../../utils/sendResponse';

const createBookOrder = catchAsync(async (req: Request, res: Response) => {
  const customer = req.user?._id;

  if (!customer) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User Not Authenticated');
  }

  const { product, quantity } = req.body;

  if (!product || !quantity) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Product and quantity are required.'
    );
  }

  const bookOrderData = {
    ...req.body,
    customer,
  };

  const result = await orderBookService.createBookOrderService(
    bookOrderData,
    customer
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Book order created successfully',
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

export const orderBookController = {
  createBookOrder,
  getUserBookOrders,
  updateBookOrderQuantity,
  deleteBookOrder,
  adminDeleteBookOrder,
};
