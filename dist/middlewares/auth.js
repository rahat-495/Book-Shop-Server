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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../app/config"));
const AppError_1 = __importDefault(require("../app/errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../app/modules/users/user.model");
const catchAsync_1 = __importDefault(require("../app/utils/catchAsync"));
const auth = (...requiredRole) => {
    // const auth = (...requiredRole: string[]) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // const token = req.headers.authorization?.split(' ')[1];
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
        const { email, role } = decoded;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const isActiveStatus = user === null || user === void 0 ? void 0 : user.isActivate;
        if (isActiveStatus === false) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is deactivated !!');
        }
        if (requiredRole && !requiredRole.includes(role)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not authorized');
        }
        req.user = decoded;
        // req.user = decoded as JwtPayload;
        // req.user = user;
        // req.user._id = _id;
        next();
    }));
};
exports.default = auth;
