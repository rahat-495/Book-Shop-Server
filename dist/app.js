"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
<<<<<<< HEAD
=======
// import authRoutes from './app/modules/auth/auth.routes';
// import UserRoutes from './app/modules/users/user.routes';
>>>>>>> cbd6a4473eaa8484f0ab3da24c664fc277bd65e4
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: ['http://localhost:5173'], credentials: true }));
app.use((0, cookie_parser_1.default)());
<<<<<<< HEAD
app.use("/api/v1", routes_1.default);
=======
app.use('/api/v1', routes_1.default);
// app.use('/api/auth', authRoutes);
// app.use('/api/user', UserRoutes);
>>>>>>> cbd6a4473eaa8484f0ab3da24c664fc277bd65e4
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Book shop server is running !' });
});
exports.default = app;
