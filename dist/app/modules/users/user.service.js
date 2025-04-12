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
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.role = 'admin';
    const result = yield user_model_1.User.create(payload);
    return result;
});
const getUserFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.email });
    return result;
});
const updateUserActiveStatusIntoDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield user_model_1.User.findById(id);
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if ((userId === null || userId === void 0 ? void 0 : userId.isActivate) == false) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User already deactivate');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isActivate: false }, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getAllUsersFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ role: "user" }).select('-password');
    return result;
});
exports.UserService = {
    getUserFromDB,
    createUserIntoDB,
    getAllUsersFromDb,
    updateUserActiveStatusIntoDb,
};
