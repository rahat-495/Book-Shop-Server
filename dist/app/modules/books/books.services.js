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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookServices = void 0;
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const books_model_1 = require("./books.model");
const createBookIntoDb = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check the author is valid or not ------------------
    if (file) {
        const path = file.path;
        const imageName = `${payload.title}${payload.category}`;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        payload.image = secure_url;
    }
    console.log(file);
    const result = yield books_model_1.booksModel.create(payload);
    return result;
});
exports.bookServices = {
    createBookIntoDb,
};
