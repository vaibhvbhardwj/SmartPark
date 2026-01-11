import express from "express";
import {
  submitRating,
  getRatingsByParkingArea,
  getUserRatingForParkingArea
} from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitRating);
router.get("/parking-area/:parkingAreaId", getRatingsByParkingArea);
router.get("/parking-area/:parkingAreaId/my-rating", protect, getUserRatingForParkingArea);

export default router;