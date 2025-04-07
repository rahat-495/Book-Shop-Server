import { Router } from 'express';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import { USER_ROLE } from './user.const';
import validateRequest from '../../../middlewares/validateRequest';
import auth from '../../../middlewares/auth';

const UserRoutes = Router();
UserRoutes.post(
  '/create-admin',
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.createUser
);

UserRoutes.patch(
  '/:id/block',
  auth('admin'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUserActiveStatus
);

UserRoutes.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getUser
);

export default UserRoutes;
