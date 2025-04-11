import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { AuthServices } from './auth.service';
import config from '../../config';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'User registered successfully',
    data: {
      _id: result._id,
      name: result.name,
      email: result.email,
      // password: result?.password,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successful',
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'New access token generated',
    data: result,
  });
});

const requestForUpdateUserPassword = catchAsync(async (req : Request , res : Response) => {
  const result = await AuthServices.requestForUpdateUserPassword(req.body) ;
  if(result){
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Email are sended, check your email !',
      data: {},
    });
  }
})

const updateUserPassword = catchAsync(async (req : Request , res : Response) => {
  const result = await AuthServices.updateUserPassword(req.body) ;
  if(result){
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Email are sended !',
      data: result,
    });
  }
})

export const AuthControllers = {
  login,
  register,
  refreshToken,
  updateUserPassword ,
  requestForUpdateUserPassword ,
};
