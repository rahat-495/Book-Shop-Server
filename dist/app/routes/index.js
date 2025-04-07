"use strict";
<<<<<<< HEAD
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.default,
=======
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_routes_1 = require("../modules/books/books.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/books",
        route: books_routes_1.booksRoutes,
>>>>>>> 6c0a4ab4f3ce8f78b235c5fe7d2f3d2b8deeca06
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
