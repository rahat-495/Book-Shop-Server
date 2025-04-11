"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = require("express");
const books_controllers_1 = require("./books.controllers");
const books_validations_1 = require("./books.validations");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = (0, express_1.Router)();
router.get('/', books_controllers_1.bookControllers.getAllBooks);
router.delete('/:id', (0, auth_1.default)('admin'), books_controllers_1.bookControllers.removeBook);
router.get('/get-single-book/:id', books_controllers_1.bookControllers.getSingleBook);
router.post('/create-book', (0, validateRequest_1.default)(books_validations_1.bookValidations.createBookValidationSchema), (0, auth_1.default)('admin'), books_controllers_1.bookControllers.createBook);
router.put('/update-book/:id', (0, validateRequest_1.default)(books_validations_1.bookValidations.updateBookValidationSchema), (0, auth_1.default)('admin'), books_controllers_1.bookControllers.updateBook);
exports.booksRoutes = router;
