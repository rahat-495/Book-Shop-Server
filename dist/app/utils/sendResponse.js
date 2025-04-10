"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, payload) => {
    res.status(payload === null || payload === void 0 ? void 0 : payload.statusCode).json({
        success: payload === null || payload === void 0 ? void 0 : payload.success,
        message: payload === null || payload === void 0 ? void 0 : payload.message,
        meta: payload === null || payload === void 0 ? void 0 : payload.meta,
        data: payload === null || payload === void 0 ? void 0 : payload.data,
    });
};
exports.default = sendResponse;
