import express from "express";
import {
  registerCompany,
  getAllCompanies,
  getCompanyDetails,
  updateCompany
} from "../controllers/companyController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only routes
router.post("/register", protect, adminOnly, registerCompany);
router.get("/", protect, adminOnly, getAllCompanies);
router.get("/:id", protect, getCompanyDetails);
router.put("/:id", protect, updateCompany);

export default router;