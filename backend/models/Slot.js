import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED"],
      default: "AVAILABLE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Slot", slotSchema);
