import express from "express";
import {
  createParkingArea,
  getAllParkingAreas,
  getNearbyParkingAreas,
  getParkingAreaById,
  updateParkingArea,
  makeParkingAreaLive,
  deleteParkingArea
} from "../controllers/parkingAreaController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create parking area (admin or company admin)
router.post("/", protect, createParkingArea);

// Get all parking areas
router.get("/", protect, getAllParkingAreas);

// Get nearby parking areas
router.get("/nearby", protect, getNearbyParkingAreas);

// Get parking area details
router.get("/:id", protect, getParkingAreaById);

// Update parking area
router.put("/:id", protect, updateParkingArea);

// Make parking area live
router.patch("/:id/make-live", protect, makeParkingAreaLive);

// Delete parking area
router.delete("/:id", protect, deleteParkingArea);

export default router;