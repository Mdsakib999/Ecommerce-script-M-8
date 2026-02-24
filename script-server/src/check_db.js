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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("./models/Product"));
dotenv_1.default.config();
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/homiara";
const checkDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(mongoURI);
        console.log("Connected to MongoDB...");
        const count = yield Product_1.default.countDocuments();
        console.log(`Total products in DB: ${count}`);
        const sample = yield Product_1.default.findOne({ name: /Abstract Golden Sun/i });
        if (sample) {
            console.log("Found sample product:", sample.name);
            console.log("Category:", sample.category);
        }
        else {
            console.log("Sample product NOT found.");
        }
        const categories = yield Product_1.default.distinct("category");
        console.log("Categories in DB:", categories);
        process.exit();
    }
    catch (error) {
        console.error("Error during check:", error);
        process.exit(1);
    }
});
checkDB();
