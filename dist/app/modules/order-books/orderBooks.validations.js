"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookOrderValidationSchema = void 0;
const zod_1 = require("zod");
const createBookOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer: zod_1.z.string({ required_error: 'Customer must be provided' }),
        product: zod_1.z.string({ required_error: 'Product (book) must be selected' }),
        quantity: zod_1.z
            .number({ required_error: 'Quantity must be provided' })
            .int('Quantity must be an integer')
            .positive('Quantity must be greater than zero'),
        totalPrice: zod_1.z
            .number({ required_error: 'Total price must be provided' })
            .positive('Total price must be a positive number'),
        status: zod_1.z
            .enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'])
            .optional(),
    }),
});
exports.BookOrderValidationSchema = {
    createBookOrderValidationSchema,
};
