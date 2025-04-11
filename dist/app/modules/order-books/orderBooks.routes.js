"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderBooks_controller_1 = require("./orderBooks.controller");
const user_const_1 = require("../users/user.const");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const OrderBookRouter = (0, express_1.Router)();
OrderBookRouter.post('/create-order', (0, auth_1.default)(user_const_1.USER_ROLE.user), orderBooks_controller_1.orderBookController.createBookOrder);
OrderBookRouter.post('/verify', (0, auth_1.default)(user_const_1.USER_ROLE.user), orderBooks_controller_1.orderBookController.verifyBookOrder);
OrderBookRouter.get('/my-orders', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), orderBooks_controller_1.orderBookController.getUserBookOrders);
OrderBookRouter.patch('/update-order-quantity/:orderId', (0, auth_1.default)(user_const_1.USER_ROLE.user), orderBooks_controller_1.orderBookController.updateBookOrderQuantity);
OrderBookRouter.delete('/:orderId', (0, auth_1.default)(user_const_1.USER_ROLE.user), orderBooks_controller_1.orderBookController.deleteBookOrder);
OrderBookRouter.delete('/:orderId', (0, auth_1.default)(user_const_1.USER_ROLE.admin), orderBooks_controller_1.orderBookController.adminDeleteBookOrder);
exports.default = OrderBookRouter;
