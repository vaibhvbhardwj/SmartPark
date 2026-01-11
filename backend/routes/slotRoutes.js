import express from "express";
import {
  bulkCreateSlots,
  getSlotsByParkingArea,
  deleteSlotsByParkingArea,
  updateSlot,
  bulkUpdateSlotStatus
} from "../controllers/slotController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin creates slot layout
router.post("/bulk-create", protect, bulkCreateSlots);

// User fetches slots (movie-style grid)
router.get("/by-parking/:parkingAreaId", protect, getSlotsByParkingArea);

// Admin delete slots by parking area
router.delete("/by-parking/:areaId", protect, deleteSlotsByParkingArea);

// Admin update single slot
router.put("/:slotId", protect, updateSlot);

// Admin bulk update slot status (maintenance)
router.patch("/bulk-update-status", protect, bulkUpdateSlotStatus);

export default router;
