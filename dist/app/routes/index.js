"use strict";
<<<<<<< HEAD
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_routes_1 = require("../modules/books/books.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/books",
        route: books_routes_1.booksRoutes,
=======
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
>>>>>>> cbd6a4473eaa8484f0ab3da24c664fc277bd65e4
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
