"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const user_validation_1 = require("../users/user.validation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const authRoutes = (0, express_1.Router)();
authRoutes.post('/register', (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), auth_controller_1.AuthControllers.register);
authRoutes.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.login);
authRoutes.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
exports.default = authRoutes;
