import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true
    },
    parkingArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingArea",
      required: true
    },
    floor: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "UNDER_MAINTENANCE"],
      default: "AVAILABLE"
    },
    slotType: {
      type: String,
      enum: ["NORMAL", "EV", "HANDICAPPED", "RESERVED"],
      default: "NORMAL"
    },
    position: {
      row: Number,
      column: Number
    }
  },
  { timestamps: true }
);

// Compound unique index: same slot number can exist on different floors and parking areas
slotSchema.index(
  { parkingArea: 1, floor: 1, slotNumber: 1 },
  { unique: true }
);

export default mongoose.model("Slot", slotSchema);