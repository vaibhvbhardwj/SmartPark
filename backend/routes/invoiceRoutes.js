import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { generateInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

// User invoice
router.get("/user/:bookingId", protect, generateInvoice);

// Admin invoice
router.get("/admin/:bookingId", protect, adminOnly, generateInvoice);

export default router;
