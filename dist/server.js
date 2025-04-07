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
const mongoose_1 = __importDefault(require("mongoose"));
<<<<<<< HEAD
const config_1 = __importDefault(require("./app/config"));
const app_1 = __importDefault(require("./app"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.databaseUrl);
            app_1.default.listen(config_1.default.port, () => {
                console.log(`Example app listening on port ${config_1.default.port}`);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
=======
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
let server;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.databaseUrl)
            .then(() => {
            console.log("Connected to MongoDB");
        }).catch((error) => {
            console.error("MongoDB connection error:", error);
        });
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`server are running at port ${config_1.default.port} !`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
>>>>>>> 6c0a4ab4f3ce8f78b235c5fe7d2f3d2b8deeca06
main();
