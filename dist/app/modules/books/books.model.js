"use strict";
<<<<<<< HEAD
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksModel = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Fiction", "Non-Fiction", "Fantasy", "Romance", "Science", "Biography"],
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    stock: {
        type: Number,
        required: true,
        min: 1,
    },
    publishedDate: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.booksModel = (0, mongoose_1.model)("Book", bookSchema);
=======
>>>>>>> cbd6a4473eaa8484f0ab3da24c664fc277bd65e4
