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
exports.deleteCoupon = exports.createCoupon = exports.getAllCoupons = exports.updateOrderStatus = exports.getOrderDetails = exports.getAllOrders = exports.deleteBanner = exports.getBannerById = exports.getBanner = exports.updateBanner = exports.addBanner = exports.updateUserRole = exports.getAllUsers = exports.getAllProducts = exports.deleteProduct = exports.toggleProductFeatured = exports.updateProduct = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const Banner_1 = __importDefault(require("../models/Banner"));
const User_1 = __importDefault(require("../models/User"));
const Order_1 = __importDefault(require("../models/Order"));
const mongoose_1 = __importDefault(require("mongoose"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
// @desc    Create Product
// @route   POST /api/admin/create-product
// @access  Private
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, description, sku, price, discountPrice, category, brand, availableColors, availableSizes, tags, countInStock, isCustomizable, customizationOptions, featured, } = req.body;
        const files = req.files;
        if (!files || files.length === 0) {
            throw new Error("No files uploaded");
        }
        let parsedAvailableColors = availableColors;
        if (typeof availableColors === "string") {
            parsedAvailableColors = JSON.parse(availableColors);
        }
        let parsedAvailableSizes = availableSizes;
        if (typeof availableSizes === "string") {
            parsedAvailableSizes = availableSizes
                .split(",")
                .map((size) => size.trim());
        }
        // Upload images to Cloudinary
        const imageUploads = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: "products",
            });
            return { url: result.secure_url, public_id: result.public_id };
        })));
        // Create new product
        const newProduct = new Product_1.default({
            name,
            slug,
            description,
            sku,
            price,
            discountPrice,
            category,
            brand,
            images: imageUploads,
            availableColors: parsedAvailableColors,
            availableSizes: parsedAvailableSizes,
            tags,
            countInStock,
            isCustomizable,
            customizationOptions,
            featured,
        });
        const savedProduct = yield newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
// @desc    Create Product
// @route   PATCH /api/admin/update-product
// @access  Private
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield Product_1.default.findById(id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        const updateFields = {};
        const fields = [
            "name",
            "slug",
            "description",
            "sku",
            "price",
            "discountPrice",
            "category",
            "brand",
            "availableColors",
            "availableSizes",
            "tags",
            "countInStock",
            "isCustomizable",
            "customizationOptions",
            "featured",
        ];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });
        // Parse availableColors if provided as a JSON string
        if (updateFields.availableColors &&
            typeof updateFields.availableColors === "string") {
            updateFields.availableColors = JSON.parse(updateFields.availableColors);
        }
        if (updateFields.availableSizes &&
            typeof updateFields.availableSizes === "string") {
            updateFields.availableSizes = updateFields.availableSizes
                .split(",")
                .map((size) => size.trim());
        }
        const files = req.files;
        if (files && files.length > 0) {
            const imageUploads = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.default.uploader.upload(file.path, {
                    folder: "products",
                });
                return { url: result.secure_url, public_id: result.public_id };
            })));
            updateFields.images = imageUploads;
        }
        const updatedProduct = yield Product_1.default.findByIdAndUpdate(id, updateFields, {
            new: true,
        });
        res.status(200).json({ success: true, product: updatedProduct });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error updating product:", error.message);
            res.status(500).json({ success: false, message: error.message });
        }
        else {
            res
                .status(500)
                .json({ success: false, message: "An unknown error occurred" });
        }
    }
});
exports.updateProduct = updateProduct;
// @desc    Toggle product featured status
// @route   PATCH /api/admin/products/:id/toggle-featured
// @access  Private
const toggleProductFeatured = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield Product_1.default.findById(id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        // Toggle the featured status
        const updatedProduct = yield Product_1.default.findByIdAndUpdate(id, { featured: !product.featured }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: `Product ${(updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.featured)
                ? "marked as featured"
                : "removed from featured"}`,
            product: updatedProduct,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error toggling featured status:", error.message);
            res.status(500).json({ success: false, message: error.message });
        }
        else {
            res
                .status(500)
                .json({ success: false, message: "An unknown error occurred" });
        }
    }
});
exports.toggleProductFeatured = toggleProductFeatured;
// @desc    Delete Product
// @route   DELETE /api/admin/delete-product/:id
// @access  Private
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        yield Promise.all(product.images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            yield cloudinary_1.default.uploader.destroy(image.public_id);
        })));
        yield Product_1.default.findByIdAndDelete(productId);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
// @desc    Get All Products
// @route   GET /api/admin/
// @access  Private
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
/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select("-password").lean();
        if (!users) {
            res.status(404).json({ message: "No users found" });
            return;
        }
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error while retrieving users" });
    }
});
exports.getAllUsers = getAllUsers;
/**
 * @desc    Update a user's role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        // Validate new role
        const allowedRoles = ["user", "editor", "admin"]; // adjust roles as needed
        if (!role || !allowedRoles.includes(role)) {
            res.status(400).json({ message: "Invalid or missing role" });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.role = role;
        yield user.save();
        res.status(200).json({
            message: "User role updated successfully",
            user: { id: user._id, role: user.role },
        });
    }
    catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Server error while updating user role" });
    }
});
exports.updateUserRole = updateUserRole;
// BANNER
const addBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { header, subHeader } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "No image file uploaded" });
            return;
        }
        const uploadResult = yield cloudinary_1.default.uploader.upload(file.path, {
            folder: "banners",
        });
        const newBanner = new Banner_1.default({
            header,
            subHeader,
            image: uploadResult.secure_url,
        });
        const savedBanner = yield newBanner.save();
        res.status(201).json(savedBanner);
    }
    catch (error) {
        console.error("Error adding banner:", error);
        res.status(500).json({ message: "Failed to add banner" });
    }
});
exports.addBanner = addBanner;
const updateBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { header, subHeader } = req.body;
        const banner = yield Banner_1.default.findById(id);
        if (!banner) {
            res.status(404).json({ message: "Banner not found" });
            return;
        }
        let updatedFields = {
            header: header || banner.header,
            subHeader: subHeader || banner.subHeader,
        };
        const file = req.file;
        if (file) {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: "banners",
            });
            updatedFields.image = result.secure_url;
        }
        const updatedBanner = yield Banner_1.default.findByIdAndUpdate(id, updatedFields, {
            new: true,
        });
        res.status(200).json(updatedBanner);
    }
    catch (error) {
        console.error("Error updating banner:", error);
        res.status(500).json({ message: "Failed to update banner" });
    }
});
exports.updateBanner = updateBanner;
const getBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = yield Banner_1.default.find();
        res.status(200).json(banners);
    }
    catch (error) {
        console.error("Error fetching banners:", error);
        res.status(500).json({ message: "Failed to fetch banners" });
    }
});
exports.getBanner = getBanner;
const getBannerById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const banner = yield Banner_1.default.findById(id);
        if (!banner) {
            res.status(404).json({ message: "Banner not found" });
            return;
        }
        res.status(200).json(banner);
    }
    catch (error) {
        console.error("Error fetching banner by ID:", error);
        res.status(500).json({ message: "Failed to fetch banner by ID" });
    }
});
exports.getBannerById = getBannerById;
const deleteBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Banner_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: "Banner not found." });
            return;
        }
    }
    catch (error) {
        console.error("Error Deleting", error);
        res.status(500).json({ message: "Failed to Delete Banner" });
    }
});
exports.deleteBanner = deleteBanner;
// Order
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find();
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching Orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});
exports.getAllOrders = getAllOrders;
const getOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield Order_1.default.findById(id)
            .populate({
            path: "items.productId",
            select: "name images",
        })
            .lean();
        if (!order) {
            res.status(404).json({ message: "Order not found." });
            return;
        }
        res.status(200).json(order);
    }
    catch (err) {
        console.error(`Error fetching order ${req.params.id}:`, err);
        res.status(500).json({ message: "Failed to fetch orderdetails" });
    }
});
exports.getOrderDetails = getOrderDetails;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid or missing status." });
            return;
        }
        const updatedOrder = yield Order_1.default.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!updatedOrder) {
            res.status(404).json({ message: "Order not found." });
            return;
        }
        res.status(200).json(updatedOrder);
    }
    catch (err) {
        console.error(`Error updating order status`, err);
        res.status(500).json({ message: "Failed to update order status" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// get all the coupons
const getAllCoupons = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield Coupon_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    }
    catch (err) {
        console.error("Error fetching coupons:", err);
        res.status(500).json({ message: "Failed to fetch coupons." });
    }
});
exports.getAllCoupons = getAllCoupons;
// create a coupon code
const createCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("BODY:", req.body);
        const { code, discountType, discountValue, minPurchase, maxDiscountAmount, usageLimit, perUserLimit, expirationDate, active, } = req.body;
        if (!code ||
            !discountType ||
            discountValue === undefined ||
            !expirationDate) {
            res.status(400).json({
                message: "code, discountType, discountValue, and expirationDate are required.",
            });
            return;
        }
        const parsedDate = new Date(expirationDate);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({
                message: "expirationDate must be a valid date string (e.g. '2025-05-31').",
            });
            return;
        }
        const normalizedCode = code.trim().toUpperCase();
        const existing = yield Coupon_1.default.findOne({ code: normalizedCode });
        if (existing) {
            res.status(400).json({ message: "Coupon code already exists." });
            return;
        }
        const newCoupon = new Coupon_1.default(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ code: normalizedCode, discountType,
            discountValue }, (minPurchase !== undefined && minPurchase !== ""
            ? { minPurchase: Number(minPurchase) }
            : {})), (maxDiscountAmount !== undefined && maxDiscountAmount !== ""
            ? { maxDiscountAmount: Number(maxDiscountAmount) }
            : {})), (usageLimit !== undefined && usageLimit !== ""
            ? { usageLimit: Number(usageLimit) }
            : {})), (perUserLimit !== undefined && perUserLimit !== ""
            ? { perUserLimit: Number(perUserLimit) }
            : {})), { expirationDate: parsedDate, active: active === undefined ? true : Boolean(active) }));
        const savedCoupon = yield newCoupon.save();
        res.status(201).json(savedCoupon);
    }
    catch (err) {
        console.error("Error creating coupon:", err);
        res.status(500).json({ message: "Failed to create coupon." });
    }
});
exports.createCoupon = createCoupon;
// delete coupon code
const deleteCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid coupon ID." });
            return;
        }
        const deleted = yield Coupon_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: "Coupon not found." });
            return;
        }
        res.status(200).json({ message: "Coupon deleted successfully." });
    }
    catch (err) {
        console.error("Error deleting coupon:", err);
        res.status(500).json({ message: "Failed to delete coupon." });
    }
});
exports.deleteCoupon = deleteCoupon;
