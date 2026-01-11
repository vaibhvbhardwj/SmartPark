import express from "express";
import { createSlot, getAllBookings, getAdminStats } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/slot", protect, adminOnly, createSlot);
router.get("/bookings", protect, adminOnly, getAllBookings);
router.get("/stats", protect, adminOnly, getAdminStats);

export default router;
