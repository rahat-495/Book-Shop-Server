"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookValidations = void 0;
const zod_1 = require("zod");
const createBookValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        author: zod_1.z.string(),
        description: zod_1.z.string(),
        category: zod_1.z.enum(["Fiction", "Non-Fiction", "Fantasy", "History", "Science", "Biography"]),
        price: zod_1.z.number(),
        stock: zod_1.z.number().min(1),
        publishedDate: zod_1.z.string(),
        availability: zod_1.z.boolean().optional(),
    })
});
exports.bookValidations = {
    createBookValidationSchema,
};
