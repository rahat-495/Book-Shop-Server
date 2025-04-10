import { Router } from 'express';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import { USER_ROLE } from './user.const';
import validateRequest from '../../../middlewares/validateRequest';
import auth from '../../../middlewares/auth';

const router = Router();
router.post(
  '/create-admin',
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.createUser
);

router.patch(
  '/:id/block',
  auth('admin'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUserActiveStatus
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getUser
);

export const userRoutes = router ;
