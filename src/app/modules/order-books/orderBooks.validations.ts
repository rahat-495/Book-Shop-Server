import { z } from 'zod';

const createBookOrderValidationSchema = z.object({
  body: z.object({
    customer: z.string({ required_error: 'Customer must be provided' }),
    product: z.string({ required_error: 'Product (book) must be selected' }),
    quantity: z
      .number({ required_error: 'Quantity must be provided' })
      .int('Quantity must be an integer')
      .positive('Quantity must be greater than zero'),
    totalPrice: z
      .number({ required_error: 'Total price must be provided' })
      .positive('Total price must be a positive number'),
    status: z
      .enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'])
      .optional(),
  }),
});

export const BookOrderValidationSchema = {
  createBookOrderValidationSchema,
};
