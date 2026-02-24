"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.post("/create-product", multer_1.default.array("images"), admin_controller_1.createProduct);
router.put("/update-product/:id", multer_1.default.array("images"), admin_controller_1.updateProduct);
router.patch("/products/:id/toggle-featured", admin_controller_1.toggleProductFeatured);
router.delete("/delete-product/:id", admin_controller_1.deleteProduct);
// Not Admin Route
router.get("/", admin_controller_1.getAllProducts);
// Users
router.get("/users", admin_controller_1.getAllUsers);
router.patch("/users/:id/role", admin_controller_1.updateUserRole);
// Content
router.get("/get-banner", admin_controller_1.getBanner);
router.get("/get-banner/:id", admin_controller_1.getBannerById);
router.post("/create-banner", multer_1.default.single("image"), admin_controller_1.addBanner);
router.patch("/update-banner/:id", multer_1.default.single("image"), admin_controller_1.updateBanner);
router.delete("/delete-banner/:id", admin_controller_1.deleteBanner);
// orders
router.get("/all-orders", admin_controller_1.getAllOrders);
router.get("/order-details/:id", admin_controller_1.getOrderDetails);
router.patch("/update-status/:id", admin_controller_1.updateOrderStatus);
// coupon
router.get("/coupons", admin_controller_1.getAllCoupons);
router.post("/create-coupon", admin_controller_1.createCoupon);
router.delete("/delete-coupon/:id", admin_controller_1.deleteCoupon);
exports.default = router;
