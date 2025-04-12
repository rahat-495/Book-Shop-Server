/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUser } from '../users/user.interface';
import { User } from '../users/user.model';
import { TLoginUser, TUpdatePassword } from './auth.interface';
import AppError from '../../errors/AppError';
import config from '../../config';
import http from 'http-status-codes';
import { sendEmail } from '../../utils/sendEmail';

const register = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
  // return await User.findById(result._id).select('+password');
};

const login = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  if (!user.isActivate) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deactivated!');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials!');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password, ...remainingData } = user.toObject();

  return { accessToken, refreshToken, user: remainingData };
};

const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwtRefreshSecret as string,
    ) as JwtPayload;
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    if (!user.isActivate) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is deactivated!');
    }

    const accessToken = generateAccessToken(user);
    return { accessToken };
  } catch (error) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Invalid or expired refresh token',
    );
  }
};

const generateAccessToken = (user: TUser) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwtAccessSecret as string,
    { expiresIn: '15d' },
  );
};

const generateRefreshToken = (user: TUser) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwtRefreshSecret as string,
    { expiresIn: '365d' },
  );
};

const requestForUpdateUserPassword = async (payload : Partial<TUser>) => {
  const isUserAxist = await User.findOne({email : payload.email}) ;
  if(!isUserAxist){
    throw new AppError(404 , "User Not Found !") ;
  }
  
  if(!isUserAxist.isActivate){
    throw new AppError(http.UNAUTHORIZED , "You are inactiva !") ;
  }

  const resetToken = await jwt.sign(
    {
      _id: isUserAxist._id,
      email: isUserAxist.email,
      role: isUserAxist.role,
    },
    config.jwtRefreshSecret as string,
    { expiresIn: '365d' },
  );
  const resetUiLink = `${config.resetPassUILink}?email=${isUserAxist?.email}&token=${resetToken}` ;
  sendEmail(isUserAxist?.email , resetUiLink) ;
  return {} ;
}

const updateUserPassword = async (payload : TUpdatePassword) => {
  const isUserAxist = await User.findOne({email : payload.email}).select("+password") ;
  if(!isUserAxist){
    throw new AppError(404 , "User Not Found !") ;
  }
  
  if(!isUserAxist.isActivate){
    throw new AppError(http.FORBIDDEN , "You are inactiva !") ;
  }
  
  const checkPassword = await bcrypt.compare(payload.oldPassword , isUserAxist?.password) ;
  if(!checkPassword){
    throw new AppError(http.FORBIDDEN , "Password is not matched !") ;
  }

  const newPassword = await bcrypt.hash(payload?.newPassword , 10) ;
  const result = await User.findByIdAndUpdate(isUserAxist?._id , {password : newPassword} , {new : true}) ;
  return result ;
}

export const AuthServices = {
  login,
  register,
  refreshToken,
  updateUserPassword ,
  requestForUpdateUserPassword ,
};
