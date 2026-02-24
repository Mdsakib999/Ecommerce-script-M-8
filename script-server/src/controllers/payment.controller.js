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
exports.applyCoupon = exports.saveOrder = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const Order_1 = __importDefault(require("../models/Order"));
const dotenv_1 = __importDefault(require("dotenv"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items, userId } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: "items array is required" });
            return;
        }
        // 1) Sum up USD subtotal (in dollars)
        let usdSubtotal = 0;
        for (const item of items) {
            if (typeof item.price !== "number" || typeof item.quantity !== "number") {
                res
                    .status(400)
                    .json({ message: "Each item must have numeric price and quantity" });
                return;
            }
            usdSubtotal += item.price * item.quantity;
        }
        // 2) Stripe requires amount in cents (smallest currency unit)
        const amountInCents = Math.round(usdSubtotal * 100);
        // 3) Enforce Stripe's minimum ($0.50)
        if (amountInCents < 50) {
            res.status(400).json({
                message: "Order total is too low. Minimum payable in USD is $0.50.",
            });
            return;
        }
        // 4) Create the PaymentIntent in USD
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            payment_method_types: ["card"],
            metadata: {
                userId: userId || "guest",
            },
        });
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            usdSubtotal: usdSubtotal.toFixed(2),
            amountInCents,
        });
    }
    catch (error) {
        console.error("createPaymentIntent error:", error);
        res
            .status(500)
            .json({ message: error.message || "Failed to create PaymentIntent" });
    }
});
exports.createPaymentIntent = createPaymentIntent;
const saveOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, contactNo, address, apartmentNo, city, items, totalAmount, paymentIntentId, couponCode, discount, } = req.body;
        if (!firstName ||
            !lastName ||
            !contactNo ||
            !address ||
            !city ||
            !Array.isArray(items) ||
            items.length === 0 ||
            typeof totalAmount !== "number" ||
            !paymentIntentId) {
            res.status(400).json({ message: "Missing required order details" });
            return;
        }
        const pi = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (pi.status !== "succeeded") {
            res.status(400).json({ message: "Payment not completed" });
            return;
        }
        const newOrder = new Order_1.default({
            firstName,
            lastName,
            contactNo,
            address,
            apartmentNo: apartmentNo || undefined,
            city,
            items: items.map((it) => ({
                productId: it.productId,
                size: it.size,
                color: it.color,
                quantity: it.quantity,
                price: it.price,
            })),
            totalAmount,
            // Stripe metadata
            stripeSessionId: pi.id,
            paymentIntentId: pi.id,
            paymentStatus: "paid",
            status: "Processing",
            couponCode: couponCode || undefined, // store coupon if used
            discount: discount || 0, // store discount amount
        });
        // 4️⃣ Save and respond
        const saved = yield newOrder.save();
        res.status(201).json({ message: "Order saved", order: saved });
    }
    catch (err) {
        console.error("saveOrder error:", err);
        res.status(500).json({ message: err.message || "Failed to save order" });
    }
});
exports.saveOrder = saveOrder;
const applyCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, subtotal, userId } = req.body;
    try {
        // 1) Look up coupon by code (uppercase & trimmed)
        const coupon = yield Coupon_1.default.findOne({ code: code.toUpperCase().trim() });
        if (!coupon) {
            res.status(404).json({ success: false, message: "Invalid coupon code" });
            return;
        }
        // 2) Check active flag and expiration
        const now = new Date();
        if (!coupon.active || coupon.expirationDate < now) {
            res
                .status(400)
                .json({ success: false, message: "Coupon expired or inactive" });
            return;
        }
        // 3) Check minimum purchase
        if (coupon.minPurchase !== undefined && subtotal < coupon.minPurchase) {
            res.status(400).json({
                success: false,
                message: `Minimum purchase of $${coupon.minPurchase} required`,
            });
            return;
        }
        if (coupon.usageLimit && coupon.usageLimit > 0) {
            const totalUsed = yield Order_1.default.countDocuments({ couponCode: coupon.code });
            if (totalUsed >= coupon.usageLimit) {
                res
                    .status(400)
                    .json({ success: false, message: "Coupon usage limit reached" });
                return;
            }
        }
        // 5) Check per-user limit
        if (coupon.perUserLimit && coupon.perUserLimit > 0) {
            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: "Login required to use this coupon",
                });
                return;
            }
            const usedByUser = yield Order_1.default.countDocuments({
                couponCode: coupon.code,
                user: userId,
            });
            if (usedByUser >= coupon.perUserLimit) {
                res.status(400).json({
                    success: false,
                    message: "Coupon already used by this user",
                });
                return;
            }
        }
        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount !== undefined &&
                discount > coupon.maxDiscountAmount) {
                discount = coupon.maxDiscountAmount;
            }
        }
        else {
            discount = coupon.discountValue;
        }
        if (discount > subtotal) {
            discount = subtotal;
        }
        const finalTotal = subtotal - discount;
        res.json({
            success: true,
            discount,
            discountType: coupon.discountType,
            finalTotal,
            message: "Coupon applied successfully!",
        });
    }
    catch (error) {
        console.error("Error applying coupon:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error while applying coupon" });
    }
});
exports.applyCoupon = applyCoupon;
