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
exports.getMyData = exports.getToken = exports.createUserInDb = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * @desc    Create MongoDB user record after Firebase signup
 * @route   POST /api/users/create-user
 * @access  PUBLIC
 */
const createUserInDb = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, contact } = req.body;
        if (!email || !name || !contact) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        let user = yield User_1.default.findOne({ email });
        if (user) {
            res.status(200).json({ message: "User already exists", user });
            return;
        }
        user = yield User_1.default.create({
            email,
            name,
            contact,
        });
        res.status(201).json({
            message: "User created successfully",
            user,
        });
        return;
    }
    catch (err) {
        console.error("createUserInDb error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createUserInDb = createUserInDb;
//  * @route /api/users/get-token
const getToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
    }
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found – please sign up first",
        });
        return;
    }
    const payload = { email: user.email, role: user.role };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.status(200).json({
        success: true,
        message: "Token generated successfully",
        data: { token },
    });
});
exports.getToken = getToken;
const getMyData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const me = req.user;
        if (!me) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const fresh = yield User_1.default.findById(me._id).select("-password -__v").lean();
        if (!fresh) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            data: fresh,
        });
    }
    catch (err) {
        console.error("Error in getMyData:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getMyData = getMyData;
