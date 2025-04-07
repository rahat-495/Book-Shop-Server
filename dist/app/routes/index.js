"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_routes_1 = require("../modules/books/books.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/books",
        route: books_routes_1.booksRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
