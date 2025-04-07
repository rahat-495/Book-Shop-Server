import { Router } from 'express';
import { orderBookController } from './orderBooks.controller';
import { USER_ROLE } from '../users/user.const';
import auth from '../../../middlewares/auth';

const OrderBookRouter = Router();

OrderBookRouter.post(
  '/create-order',
  auth(USER_ROLE.user),
  orderBookController.createBookOrder
);

OrderBookRouter.get(
  '/my-orders',
  auth(USER_ROLE.user, USER_ROLE.admin),
  orderBookController.getUserBookOrders
);

OrderBookRouter.patch(
  '/update-order-quantity/:orderId',
  auth(USER_ROLE.user),
  orderBookController.updateBookOrderQuantity
);

OrderBookRouter.delete(
  '/:orderId',
  auth(USER_ROLE.user),
  orderBookController.deleteBookOrder
);

OrderBookRouter.delete(
  '/:orderId',
  auth(USER_ROLE.admin),
  orderBookController.adminDeleteBookOrder
);

export default OrderBookRouter;
