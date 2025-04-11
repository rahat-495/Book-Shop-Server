import { Router } from 'express';
import { orderBookController } from './orderBooks.controller';
import { userRole } from '../users/user.const';
import auth from '../../../middlewares/auth';

const OrderBookRouter = Router();

OrderBookRouter.post(
  '/create-order',
  auth(userRole.user),
  orderBookController.createBookOrder
);
OrderBookRouter.get(
  '/verify',
  auth(USER_ROLE.user),
  orderBookController.verifyBookOrder
);

OrderBookRouter.get(
  '/my-orders',
  auth(userRole.user, userRole.admin),
  orderBookController.getUserBookOrders
);
OrderBookRouter.get(
  '/my-carts',
  auth(USER_ROLE.user, USER_ROLE.admin),
  orderBookController.getCartItem
);

OrderBookRouter.patch(
  '/update-order-quantity/:orderId',
  auth(userRole.user),
  orderBookController.updateBookOrderQuantity
);

OrderBookRouter.delete(
  '/:orderId',
  auth(userRole.user),
  orderBookController.deleteBookOrder
);

OrderBookRouter.delete(
  '/:orderId',
  auth(userRole.admin),
  orderBookController.adminDeleteBookOrder
);

export default OrderBookRouter;
