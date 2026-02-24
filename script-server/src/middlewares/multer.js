"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
// Ensure the 'uploads' directory exists before saving files
const uploadDirectory = path_1.default.join(__dirname, "../../public/uploads");
if (!fs_1.default.existsSync(uploadDirectory)) {
    fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
}
// Multer disk storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
