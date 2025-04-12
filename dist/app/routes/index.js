"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const books_routes_1 = require("../modules/books/books.routes");
const orderBooks_routes_1 = __importDefault(require("../modules/order-books/orderBooks.routes"));
const user_routes_1 = require("../modules/users/user.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.default,
    },
    {
        path: '/users',
        route: user_routes_1.userRoutes,
    },
    {
        path: '/books',
        route: books_routes_1.booksRoutes,
    },
    {
        path: '/orders',
        route: orderBooks_routes_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
