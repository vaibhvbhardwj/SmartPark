import express from "express";
import { bookSlot, getMyBookings, releaseSlot } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/book", protect, bookSlot);
router.get("/my", protect, getMyBookings);
router.post("/release", protect, releaseSlot);

export default router;

