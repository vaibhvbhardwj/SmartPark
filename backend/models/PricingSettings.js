import mongoose from "mongoose";

const pricingSettingsSchema = new mongoose.Schema({
  basePrice: { type: Number, default: 50 },
  hourlyRate: { type: Number, default: 100 }
});

export default mongoose.model("PricingSettings", pricingSettingsSchema);
