import mongoose from "mongoose";

const parkingAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    address: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },
    layoutType: {
      type: String,
      enum: ["RECTANGULAR", "CIRCULAR", "CUSTOM"],
      default: "RECTANGULAR"
    },
    totalFloors: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    pricePerHour: {
      type: Number,
      required: true,
      default: 50
    },
    basePrice: {
      type: Number,
      required: true,
      default: 20
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "UNDER_MAINTENANCE"],
      default: "INACTIVE"
    },
    amenities: [{
      type: String
    }],
    images: [{
      type: String
    }],
    operatingHours: {
      open: {
        type: String,
        default: "00:00"
      },
      close: {
        type: String,
        default: "23:59"
      }
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

parkingAreaSchema.index({ location: "2dsphere" });
parkingAreaSchema.index({ company: 1 });

export default mongoose.model("ParkingArea", parkingAreaSchema);