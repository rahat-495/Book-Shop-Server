import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import { booksRoutes } from '../modules/books/books.routes';
import OrderBookRouter from '../modules/order-books/orderBooks.routes';
import { userRoutes } from '../modules/users/user.routes';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/books',
    route: booksRoutes,
  },
  {
    path: '/orders',
    route: OrderBookRouter,
  },
  {
    path: '/users',
    route: userRoutes,
  },
];


moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
