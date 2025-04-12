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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OrderBookSchema = new mongoose_1.Schema({
    email: { type: String, required: false },
    customer: { type: mongoose_1.Schema.ObjectId, ref: 'User', required: true },
    id: { type: mongoose_1.Schema.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: [true, 'Quantity is required.'] },
    totalPrice: { type: Number, required: [true, 'Total price is required.'] },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    // payment section
    transaction: {
        id: { type: String, required: false },
        transactionStatus: { type: String, required: false },
        bank_status: { type: String, required: false },
        sp_code: { type: String, required: false },
        sp_message: { type: String, required: false },
        method: { type: String, required: false },
        date_time: { type: String, required: false },
    },
}, {
    timestamps: true,
});
const addToCartSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});
const OrderBook = (0, mongoose_1.model)('OrderBook', OrderBookSchema);
exports.cartModel = (0, mongoose_1.model)('cart', addToCartSchema);
exports.default = OrderBook;
