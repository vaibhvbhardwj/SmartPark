import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getUserSettings,
  updateUserProfile,
  changePassword,
  getPricingSettings, 
  updatePricingSettings 
} from "../controllers/settingsController.js";


const router = express.Router();

router.get("/me", protect, getUserSettings);
router.put("/profile", protect, updateUserProfile);
router.put("/password", protect, changePassword);
// ADMIN PRICING SETTINGS
router.get("/pricing", protect, adminOnly, getPricingSettings);
router.put("/pricing", protect, adminOnly, updatePricingSettings);

export default router;
