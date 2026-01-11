import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment, mockPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.post("/mock", protect, mockPayment); // For testing without Razorpay

export default router;