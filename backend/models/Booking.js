import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date
    },
    totalAmount: {
      type: Number
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
