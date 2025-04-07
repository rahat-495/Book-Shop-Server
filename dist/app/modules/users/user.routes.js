"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const user_const_1 = require("./user.const");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const UserRoutes = (0, express_1.Router)();
UserRoutes.post('/create-admin', (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserValidationSchema), user_controller_1.UserControllers.createUser);
UserRoutes.patch('/:id/block', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserValidationSchema), user_controller_1.UserControllers.updateUserActiveStatus);
UserRoutes.get('/', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), user_controller_1.UserControllers.getUser);
exports.default = UserRoutes;
