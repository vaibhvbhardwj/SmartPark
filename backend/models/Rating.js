import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    parkingArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingArea",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: 500
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    }
  },
  { timestamps: true }
);

// One rating per user per parking area
ratingSchema.index({ user: 1, parkingArea: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);