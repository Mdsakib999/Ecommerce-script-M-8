"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
router.post("/create-payment-intent", payment_controller_1.createPaymentIntent);
router.post("/save-order", payment_controller_1.saveOrder);
router.post("/apply-coupon", payment_controller_1.applyCoupon);
exports.default = router;
