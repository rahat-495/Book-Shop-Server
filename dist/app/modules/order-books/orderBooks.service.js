"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const orderBooks_model_1 = __importStar(require("./orderBooks.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const books_model_1 = require("../books/books.model");
const order_utils_1 = require("./order.utils");
const createBookOrderService = (data, userId, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId).session(session);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const { id, quantity } = data;
        if (!data.customer) {
            data.customer = new mongoose_1.default.Types.ObjectId(user._id);
        }
        const book = yield books_model_1.booksModel.findById(id).session(session);
        if (!book || book.stock < quantity) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Insufficient stock or book not found.');
        }
        data.totalPrice = book.price * quantity;
        book.stock -= quantity;
        yield book.save({ session });
        const orderData = Object.assign(Object.assign({}, data), { customer: user._id });
        const result = yield orderBooks_model_1.default.create([orderData], { session });
        yield result[0].populate('customer', 'name email role');
        // Payment integration
        const shurjopayPayload = {
            amount: data.totalPrice,
            order_id: result[0]._id,
            currency: 'BDT',
            customer_name: user.name,
            customer_email: user.email,
            customer_phone: 'N/A',
            customer_address: 'N/A',
            customer_city: 'N/A',
            client_ip,
        };
        const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
        if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
            yield orderBooks_model_1.cartModel.findByIdAndDelete(data === null || data === void 0 ? void 0 : data.cardId, { session });
            yield result[0].updateOne({
                transaction: {
                    id: payment.sp_order_id,
                    transactionStatus: payment.transactionStatus,
                },
            });
        }
        yield session.commitTransaction();
        session.endSession();
        // Return both order and payment link
        return { order: result[0], checkout_url: payment.checkout_url };
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Book order creation failed');
    }
});
const verifyBookOrderPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        yield orderBooks_model_1.default.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transaction_status': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status === 'Success'
                ? 'Paid'
                : verifiedPayment[0].bank_status === 'Failed'
                    ? 'Pending'
                    : verifiedPayment[0].bank_status === 'Cancel'
                        ? 'Cancelled'
                        : '',
        });
    }
    return verifiedPayment;
});
const getAllOrdersByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userOrders = yield orderBooks_model_1.default.find({ customer: userId }).populate("customer id");
    if (!userOrders || userOrders.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No orders found for this user');
    }
    return userOrders;
});
const getCartItem = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield orderBooks_model_1.cartModel.find({ email: email.slice(6) }).populate("product");
    return products;
});
const addToCartIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserAxist = yield user_model_1.User.findOne({ email: payload.email });
    if (!isUserAxist) {
        throw new AppError_1.default(404, "User not found !");
    }
    const isProductAxist = yield books_model_1.booksModel.findById(payload.product);
    if (!isProductAxist) {
        throw new AppError_1.default(404, "Book not found !");
    }
    const craeteCart = yield orderBooks_model_1.cartModel.create(payload);
    const result = yield orderBooks_model_1.cartModel.findById(craeteCart._id).populate("product");
    return result;
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
        const book = yield books_model_1.booksModel.findById(order.id).session(session);
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
    verifyBookOrderPayment,
    getAllOrdersByUser,
    addToCartIntoDb,
    getCartItem,
    updateOrderQuantityService,
    deleteOrderFromDB,
    adminDeleteOrder,
};
// old order create code=====================
// const createBookOrderService = async (data: TOrderBook, userId: string) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const user = await User.findById(userId).session(session);
//     if (!user) {
//       throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
//     }
//     const { product, quantity } = data;
//     if (!data.customer) {
//       data.customer = new mongoose.Types.ObjectId(user._id);
//     }
//     const book = await booksModel.findById(product).session(session);
//     if (!book || book.stock < quantity) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Insufficient stock or book not found.'
//       );
//     }
//     data.totalPrice = book.price * quantity;
//     book.stock -= quantity;
//     await book.save({ session });
//     const orderData = { ...data, customer: user._id };
//     const result = await OrderBook.create([orderData], { session });
//     await result[0].populate('customer', 'name email role');
//     await session.commitTransaction();
//     session.endSession();
//     return result[0];
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new AppError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Book order creation failed'
//     );
//   }
// };
