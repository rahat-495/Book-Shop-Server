import { Schema, model } from 'mongoose';
import { TOrderBook } from './orderBooks.interface';

const OrderBookSchema: Schema = new Schema<TOrderBook>(
  {
    email: { type: String, required: false },
    customer: { type: Schema.ObjectId, ref: 'User', required: true },
    product: { type: Schema.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: [true, 'Quantity is required.'] },
    totalPrice: { type: Number, required: [true, 'Total price is required.'] },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    // payment section
    // transaction: {
    //   id: { type: String, required: false },
    //   transactionStatus: { type: String, required: false },
    //   bank_status: { type: String, required: false },
    //   sp_code: { type: String, required: false },
    //   sp_message: { type: String, required: false },
    //   method: { type: String, required: false },
    //   date_time: { type: String, required: false },
    // },
  },
  {
    timestamps: true,
  }
);

const OrderBook = model<TOrderBook>('OrderBook', OrderBookSchema);
export default OrderBook;
