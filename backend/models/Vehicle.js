import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    vehicleNumber: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      enum: ["car", "bike"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
