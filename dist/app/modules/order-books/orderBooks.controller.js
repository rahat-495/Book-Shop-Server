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
exports.orderBookController = void 0;
const orderBooks_service_1 = require("./orderBooks.service");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createBookOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User Not Authenticated');
    }
    const { product, quantity } = req.body;
    if (!product || !quantity) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Product and quantity are required.');
    }
    const bookOrderData = Object.assign(Object.assign({}, req.body), { user: userId });
    const client_ip = ((_b = req.headers['x-forwarded-for']) === null || _b === void 0 ? void 0 : _b.toString().split(',')[0]) ||
        req.socket.remoteAddress ||
        '127.0.0.1';
    const result = yield orderBooks_service_1.orderBookService.createBookOrderService(bookOrderData, userId, client_ip);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Book order created successfully',
        data: result,
    });
}));
const verifyBookOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id } = req.query;
    if (!order_id || typeof order_id !== 'string') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid order_id');
    }
    const result = yield orderBooks_service_1.orderBookService.verifyBookOrderPayment(order_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Payment verification successful',
        data: result,
    });
}));
const getUserBookOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield orderBooks_service_1.orderBookService.getAllOrdersByUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
    });
}));
const getCartItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderBooks_service_1.orderBookService.getCartItem(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Carts retrieved successfully',
        data: result,
    });
}));
const updateBookOrderQuantity = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { orderId } = req.params;
    const { newQuantity } = req.body;
    if (!newQuantity || newQuantity <= 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid quantity provided');
    }
    const updatedOrder = yield orderBooks_service_1.orderBookService.updateOrderQuantityService(orderId, userId, newQuantity);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Book order quantity updated successfully',
        data: updatedOrder,
    });
}));
const deleteBookOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    yield orderBooks_service_1.orderBookService.deleteOrderFromDB(orderId, userId);
    (0, sendResponse_1.default)(res, { data: {},
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Book order deleted successfully',
    });
}));
const adminDeleteBookOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield orderBooks_service_1.orderBookService.adminDeleteOrder(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Book order deleted successfully',
        data: result,
    });
}));
const addToCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderBooks_service_1.orderBookService.addToCartIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Add to cart done !',
        data: result,
    });
}));
exports.orderBookController = {
    createBookOrder,
    addToCart,
    verifyBookOrder,
    getUserBookOrders,
    getCartItem,
    updateBookOrderQuantity,
    deleteBookOrder,
    adminDeleteBookOrder,
};
