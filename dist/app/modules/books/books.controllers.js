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
exports.bookControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const books_services_1 = require("./books.services");
const createBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_services_1.bookServices.createBookIntoDb(req.body);
    if (result) {
        (0, sendResponse_1.default)(res, { data: result, success: true, statusCode: 200, message: "Book created successfully !" });
    }
}));
const getAllBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_services_1.bookServices.getAllBooksFromDb(req.query);
    if (result) {
        (0, sendResponse_1.default)(res, { data: result.result, meta: result.meta, success: true, statusCode: 200, message: "Books retribed successfully !" });
    }
}));
const getSingleBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_services_1.bookServices.getSingleBookFromDb(req.params.id);
    if (result) {
        (0, sendResponse_1.default)(res, { data: result, success: true, statusCode: 200, message: "Book retribed successfully !" });
    }
}));
const removeBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_services_1.bookServices.removeBookFromDb(req.params.id);
    if (result) {
        (0, sendResponse_1.default)(res, { data: result, success: true, statusCode: 200, message: "Book delete successfully !" });
    }
}));
const updateBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield books_services_1.bookServices.updateBookIntoDb(req.params.id, req.body);
    if (result) {
        (0, sendResponse_1.default)(res, { data: result, success: true, statusCode: 200, message: "Book delete successfully !" });
    }
}));
exports.bookControllers = {
    updateBook,
    removeBook,
    createBook,
    getAllBooks,
    getSingleBook,
};
