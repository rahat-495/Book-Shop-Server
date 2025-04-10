import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../app/config';
import AppError from '../app/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { TUserRole } from '../app/modules/users/user.interface';
import { User } from '../app/modules/users/user.model';
import catchAsync from '../app/utils/catchAsync';

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
    }

    const decoded = jwt.verify(
      token,
      config.jwtAccessSecret as string
    ) as JwtPayload;

    const { email, role } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const isActiveStatus = user?.isActivate;

    if (isActiveStatus === false) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is deactivated !!');
    }

    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized');
    }
    req.user = decoded as JwtPayload & { role: string };

    next();
  });
};

export default auth;
