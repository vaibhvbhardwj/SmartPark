import express from "express";
import { 
  bookSlot, 
  getMyBookings, 
  getActiveBooking,
  completeBooking,
  cancelBooking,
  getAllBookings
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", protect, bookSlot);
router.get("/my", protect, getMyBookings);
router.get("/active", protect, getActiveBooking);
router.post("/complete", protect, completeBooking);
router.post("/cancel", protect, cancelBooking);

// Admin route
router.get("/all", protect, getAllBookings);

export default router;