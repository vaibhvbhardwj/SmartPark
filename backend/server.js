import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";


dotenv.config();
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



app.get("/", (req, res) => {
  res.send("Auth API running");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
