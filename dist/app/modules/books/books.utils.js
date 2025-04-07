"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTextDataToJsonData = void 0;
const parseTextDataToJsonData = (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
};
exports.parseTextDataToJsonData = parseTextDataToJsonData;
