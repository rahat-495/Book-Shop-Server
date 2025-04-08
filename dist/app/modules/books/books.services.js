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
exports.bookServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const user_model_1 = require("../users/user.model");
const books_model_1 = require("./books.model");
const createBookIntoDb = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: payload.author });
    if (!isUserExist) {
        throw new AppError_1.default(404, "User not found");
    }
    if (file) {
        const path = file.path;
        const imageName = `${payload.title}${payload.category}`;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        payload.image = secure_url;
    }
    const result = yield books_model_1.booksModel.create(payload);
    return result;
});
const getAllBooksFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query === null || query === void 0 ? void 0 : query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (query.searchTerm) {
        filter.$or = [
            { title: { $regex: query.searchTerm, $options: "i" } },
            { author: { $regex: query.searchTerm, $options: "i" } },
            { category: { $regex: query.searchTerm, $options: "i" } },
        ];
    }
    if (query.author) {
        filter.author = query.author;
    }
    if (query.category) {
        filter.category = query.category;
    }
    if (query.availability) {
        filter.availability = query.availability;
    }
    if (query.minPrice && query.maxPrice) {
        filter.price = {
            $gte: Number(query.minPrice),
            $lte: Number(query.maxPrice),
        };
    }
    else if (query.minPrice) {
        filter.price = { $gte: Number(query.minPrice) };
    }
    else if (query.maxPrice) {
        filter.price = { $lte: Number(query.maxPrice) };
    }
    const total = yield books_model_1.booksModel.find(filter).estimatedDocumentCount();
    const result = yield books_model_1.booksModel.find(filter).skip(skip).limit(limit);
    const totalPage = Math.ceil(result.length / limit);
    return { result, meta: { limit, page, total, totalPage } };
});
const getSingleBookFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_model_1.booksModel.findById(id);
    if (!result) {
        throw new AppError_1.default(404, "Book not found");
    }
    return result;
});
const removeBookFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_model_1.booksModel.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(404, "Book not found");
    }
    return result;
});
const updateBookIntoDb = (id, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookAxist = yield books_model_1.booksModel.findById(id);
    if (!isBookAxist) {
        throw new AppError_1.default(404, "Book not found");
    }
    if (file) {
        const path = file.path;
        const imageName = `${payload.title}${payload.category}`;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        payload.image = secure_url;
    }
    console.log(payload);
    const result = yield books_model_1.booksModel.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.bookServices = {
    updateBookIntoDb,
    removeBookFromDb,
    createBookIntoDb,
    getAllBooksFromDb,
    getSingleBookFromDb,
};
