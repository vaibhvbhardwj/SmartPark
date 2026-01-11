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
    parkingArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingArea",
      required: true
    },
    parkingAreaName: {
      type: String
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    estimatedEndTime: {
      type: Date
    },
    actualEndTime: {
      type: Date
    },
    estimatedDuration: {
      type: Number // in hours
    },
    duration: {
      type: Number // actual duration in hours
    },
    estimatedAmount: {
      type: Number
    },
    totalAmount: {
      type: Number
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING"
    },
    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "CASH", "WALLET"],
      default: "RAZORPAY"
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ parkingArea: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);