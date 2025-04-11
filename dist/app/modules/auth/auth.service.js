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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../users/user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const http_status_codes_2 = __importDefault(require("http-status-codes"));
const sendEmail_1 = require("../../utils/sendEmail");
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    return result;
    // return await User.findById(result._id).select('+password');
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    if (!user.isActivate) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is deactivated!');
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials!');
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const _a = user.toObject(), { password } = _a, remainingData = __rest(_a, ["password"]);
    return { accessToken, refreshToken, user: remainingData };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtRefreshSecret);
        const user = yield user_model_1.User.findOne({ email: decoded.email });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
        }
        if (!user.isActivate) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is deactivated!');
        }
        const accessToken = generateAccessToken(user);
        return { accessToken };
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
});
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, config_1.default.jwtAccessSecret, { expiresIn: '15d' });
};
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, config_1.default.jwtRefreshSecret, { expiresIn: '365d' });
};
const requestForUpdateUserPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserAxist = yield user_model_1.User.findOne({ email: payload.email });
    if (!isUserAxist) {
        throw new AppError_1.default(404, "User Not Found !");
    }
    if (!isUserAxist.isActivate) {
        throw new AppError_1.default(http_status_codes_2.default.UNAUTHORIZED, "You are inactiva !");
    }
    const resetToken = yield jsonwebtoken_1.default.sign({
        _id: isUserAxist._id,
        email: isUserAxist.email,
        role: isUserAxist.role,
    }, config_1.default.jwtRefreshSecret, { expiresIn: '365d' });
    const resetUiLink = `${config_1.default.resetPassUILink}?email=${isUserAxist === null || isUserAxist === void 0 ? void 0 : isUserAxist.email}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)(isUserAxist === null || isUserAxist === void 0 ? void 0 : isUserAxist.email, resetUiLink);
    return {};
});
const updateUserPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserAxist = yield user_model_1.User.findOne({ email: payload.email }).select("+password");
    if (!isUserAxist) {
        throw new AppError_1.default(404, "User Not Found !");
    }
    if (!isUserAxist.isActivate) {
        throw new AppError_1.default(http_status_codes_2.default.FORBIDDEN, "You are inactiva !");
    }
    const checkPassword = yield bcrypt_1.default.compare(payload.oldPassword, isUserAxist === null || isUserAxist === void 0 ? void 0 : isUserAxist.password);
    if (!checkPassword) {
        throw new AppError_1.default(http_status_codes_2.default.FORBIDDEN, "Password is not matched !");
    }
    const newPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, 10);
    const result = yield user_model_1.User.findByIdAndUpdate(isUserAxist === null || isUserAxist === void 0 ? void 0 : isUserAxist._id, { password: newPassword }, { new: true });
    return result;
});
exports.AuthServices = {
    login,
    register,
    refreshToken,
    updateUserPassword,
    requestForUpdateUserPassword,
};
