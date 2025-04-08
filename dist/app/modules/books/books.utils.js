"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTextDataToJsonData = void 0;
const parseTextDataToJsonData = (req, res, next) => {
    var _a;
    if ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data) {
        req.body = JSON.parse(req.body.data);
        next();
    }
    next();
};
exports.parseTextDataToJsonData = parseTextDataToJsonData;
