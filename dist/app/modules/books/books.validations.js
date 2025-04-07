"use strict";
<<<<<<< HEAD
=======
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
    })
});
exports.bookValidations = {
    createBookValidationSchema,
};
>>>>>>> 6c0a4ab4f3ce8f78b235c5fe7d2f3d2b8deeca06
