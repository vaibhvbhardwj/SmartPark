import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAdminAnalytics, getUserAnalytics, getAdvancedUserAnalytics, getAdvancedAdminAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/admin", protect, adminOnly, getAdminAnalytics);
router.get("/user", protect, getUserAnalytics);
router.get("/advanced-user", protect, getAdvancedUserAnalytics);
router.get("/advanced-admin", protect, adminOnly, getAdvancedAdminAnalytics);

export default router;
