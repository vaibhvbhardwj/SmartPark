import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import parkingAreaRoutes from "./routes/parkingAreaRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";




connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//middleware
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/parking-areas", parkingAreaRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/ratings", ratingRoutes);




app.get("/", (req, res) => {
  res.send("Auth API running");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
