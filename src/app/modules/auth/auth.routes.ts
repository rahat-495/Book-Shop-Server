
import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { UserValidation } from '../users/user.validation';
import validateRequest from '../../../middlewares/validateRequest';

const authRoutes = Router();

authRoutes.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),
  AuthControllers.register,
);

authRoutes.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

authRoutes.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

authRoutes.put('/request-update-password' , AuthControllers.requestForUpdateUserPassword)
authRoutes.put('/update-password' , AuthControllers.updateUserPassword)

export default authRoutes;
