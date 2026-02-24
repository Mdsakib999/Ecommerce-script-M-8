"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Order.ts
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    apartmentNo: { type: String },
    city: { type: String, required: true },
    items: [
        {
            productId: { type: String, ref: "Product", required: true },
            size: { type: String },
            color: { type: String },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    // New coupon fields
    couponCode: { type: String },
    discount: { type: Number, default: 0 },
    // Stripe
    stripeSessionId: { type: String },
    paymentIntentId: { type: String },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "failed"],
        default: "unpaid",
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
exports.default = mongoose_1.default.model("Order", OrderSchema);
