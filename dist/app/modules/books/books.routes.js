"use strict";
<<<<<<< HEAD
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = require("express");
const books_controllers_1 = require("./books.controllers");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const books_validations_1 = require("./books.validations");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const books_utils_1 = require("./books.utils");
const router = (0, express_1.Router)();
router.post('/create-book', sendImageToCloudinary_1.upload.single("file"), books_utils_1.parseTextDataToJsonData, (0, validateRequest_1.default)(books_validations_1.bookValidations.createBookValidationSchema), books_controllers_1.bookControllers.createBook);
exports.booksRoutes = router;
=======
>>>>>>> cbd6a4473eaa8484f0ab3da24c664fc277bd65e4
