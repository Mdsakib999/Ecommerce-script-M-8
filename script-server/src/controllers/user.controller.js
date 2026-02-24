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
exports.getOrderHistory = exports.getActiveCoupon = exports.createOrder = exports.getFeturedProducts = exports.getProductDetailsBySlug = exports.getProductDetails = exports.getAllProducts = exports.getMyData = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
const User_1 = __importDefault(require("../models/User"));
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
// @desc    Get All Products
// @route   GET /api/user/products/
// @access  Public
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllProducts = getAllProducts;
// @desc    Get Product Details
// @route   GET /api/user/products/:id
// @access  Public
const getProductDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield Product_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProductDetails = getProductDetails;
// @desc    Get Product Details By SLUG
// @route   GET /api/user/products/:slug
// @access  Public
const getProductDetailsBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const product = yield Product_1.default.findOne({ slug });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProductDetailsBySlug = getProductDetailsBySlug;
// @desc    Get Featured Products
// @route   GET /api/user/featured-products/
// @access  Public
const getFeturedProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({ featured: true });
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getFeturedProducts = getFeturedProducts;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, contactNo, address, apartmentNo, city, items, deliveryCharge, totalAmount, paymentMethod, } = req.body;
        if (!firstName ||
            !lastName ||
            !contactNo ||
            !address ||
            !city ||
            !Array.isArray(items) ||
            items.length === 0 ||
            deliveryCharge == null ||
            totalAmount == null ||
            !["COD", "Online"].includes(paymentMethod)) {
            res.status(400).json({ message: "Missing or invalid order data" });
            return;
        }
        const newOrder = yield Order_1.default.create({
            firstName,
            lastName,
            contactNo,
            address,
            apartmentNo: apartmentNo || undefined,
            city,
            items: items.map((i) => ({
                productId: i.productId,
                size: i.size || undefined,
                color: i.color || undefined,
                quantity: i.quantity,
                price: i.price,
            })),
            deliveryCharge,
            totalAmount,
            paymentMethod,
        });
        res.status(201).json({
            message: "Order created successfully",
        });
    }
    catch (error) {
        console.error("Error Creating Order", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createOrder = createOrder;
const getActiveCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const activeCoupons = yield Coupon_1.default.find({
            active: true,
            expirationDate: { $gte: now },
        }).sort({ createdAt: -1 });
        res.status(200).json(activeCoupons);
    }
    catch (err) {
        console.error("Error getting active coupon", err);
        res.status(500).json({ message: "Failed to get active coupon." });
    }
});
exports.getActiveCoupon = getActiveCoupon;
const getOrderHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Ensure authMiddleware has attached req.user
        if (!req.user) {
            res
                .status(401)
                .json({ message: "Unauthorized: no user found on request" });
            return;
        }
        const userId = req.user._id;
        const orders = yield Order_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({
            path: "items.productId",
            select: "name price images",
        })
            .exec();
        res.status(200).json({ orders });
    }
    catch (err) {
        console.error("Error getting order history", err);
        res.status(500).json({ message: "Failed to get order history" });
    }
});
exports.getOrderHistory = getOrderHistory;
