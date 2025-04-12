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

OrderBookRouter.put(
  '/update-order',
  auth(userRole.admin),
  orderBookController.updateBookOrder
);

OrderBookRouter.get(
  '/verify',
  auth(userRole.user),
  orderBookController.verifyBookOrder
);

OrderBookRouter.get(
  '/',
  auth(userRole.admin),
  orderBookController.getAllOrders
);

OrderBookRouter.get(
  '/my-orders',
  auth(userRole.user, userRole.admin),
  orderBookController.getUserBookOrders
);

OrderBookRouter.get(
  '/my-carts/:email',
  auth(userRole.user, userRole.admin),
  orderBookController.getCartItem
);

OrderBookRouter.post(
  '/add-to-cart',
  auth(userRole.user, userRole.admin),
  orderBookController.addToCart
);

OrderBookRouter.patch(
  '/update-order-quantity/:orderId',
  auth(userRole.user),
  orderBookController.updateBookOrderQuantity
);

OrderBookRouter.delete(
  '/:orderId',
  auth(userRole.user , userRole.admin),
  orderBookController.deleteBookOrder
);

OrderBookRouter.delete(
  '/:orderId',
  auth(userRole.admin , userRole.admin),
  orderBookController.adminDeleteBookOrder
);

export default OrderBookRouter;
