"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBookService = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../users/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const orderBooks_model_1 = __importDefault(require("./orderBooks.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const books_model_1 = require("../books/books.model");
const createBookOrderService = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId).session(session);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const { product, quantity } = data;
        if (!data.customer) {
            data.customer = new mongoose_1.default.Types.ObjectId(user._id);
        }
        const book = yield books_model_1.booksModel.findById(product).session(session);
        if (!book || book.stock < quantity) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Insufficient stock or book not found.');
        }
        data.totalPrice = book.price * quantity;
        book.stock -= quantity;
        yield book.save({ session });
        const orderData = Object.assign(Object.assign({}, data), { customer: user._id });
        const result = yield orderBooks_model_1.default.create([orderData], { session });
        yield result[0].populate('customer', 'name email role');
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Book order creation failed');
    }
});
const getAllOrdersByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userOrders = yield orderBooks_model_1.default.find({ customer: userId }).populate({
        path: 'product',
        select: 'title',
    });
    if (!userOrders || userOrders.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No orders found for this user');
    }
    return userOrders;
});
const updateOrderQuantityService = (orderId, userId, newQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const order = yield orderBooks_model_1.default.findById(orderId).session(session);
        if (!order) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
        }
        if (order.customer.toString() !== userId) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Unauthorized to update this order');
        }
        const book = yield books_model_1.booksModel.findById(order.product).session(session);
        if (!book) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Book not found');
        }
        const quantityDifference = newQuantity - order.quantity;
        if (quantityDifference > 0 && book.stock < quantityDifference) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Not enough stock available');
        }
        // Update book stock
        book.stock -= quantityDifference;
        yield book.save({ session });
        // Update order quantity and total price
        order.quantity = newQuantity;
        order.totalPrice = book.price * newQuantity;
        yield order.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const deleteOrderFromDB = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderBooks_model_1.default.findById(id);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
    }
    if (order.customer.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Unauthorized to delete this order');
    }
    return yield orderBooks_model_1.default.findByIdAndDelete(id);
});
const adminDeleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderBooks_model_1.default.findById(id);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
    }
    return yield orderBooks_model_1.default.findByIdAndDelete(id);
});
exports.orderBookService = {
    createBookOrderService,
    getAllOrdersByUser,
    updateOrderQuantityService,
    deleteOrderFromDB,
    adminDeleteOrder,
};
