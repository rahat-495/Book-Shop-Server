/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await UserService.createUserIntoDB(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User Registered Successfully',
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const result = await UserService.getUserFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users Getting Successfully',
    data: result,
  });
});

const updateUserActiveStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateUserActiveStatusIntoDb(id);
  sendResponse(res, {
    data: result ,
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Deactivated Successfully',
  });
});

export const UserControllers = {
  createUser,
  getUser,
  updateUserActiveStatus,
};
