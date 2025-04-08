"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderBookSchema = new mongoose_1.Schema({
    email: { type: String, required: false },
    customer: { type: mongoose_1.Schema.ObjectId, ref: 'User', required: true },
    product: { type: mongoose_1.Schema.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: [true, 'Quantity is required.'] },
    totalPrice: { type: Number, required: [true, 'Total price is required.'] },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    // transaction: {
    //   id: { type: String, required: false },
    //   transactionStatus: { type: String, required: false },
    //   bank_status: { type: String, required: false },
    //   sp_code: { type: String, required: false },
    //   sp_message: { type: String, required: false },
    //   method: { type: String, required: false },
    //   date_time: { type: String, required: false },
    // },
}, {
    timestamps: true,
});
const OrderBook = (0, mongoose_1.model)('OrderBook', OrderBookSchema);
exports.default = OrderBook;
