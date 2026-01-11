import User from "../models/User.js";
import bcrypt from "bcryptjs";
import PricingSettings from "../models/PricingSettings.js";

// GET USER SETTINGS
export const getUserSettings = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  const { name, phone, profilePicture } = req.body;

  const user = await User.findById(req.user.id);
  user.name = name || user.name;
  user.phone = phone || user.phone;
  if (profilePicture !== undefined) {
    user.profilePicture = profilePicture;
  }

  await user.save();
  res.json({ message: "Profile updated successfully", user: { name: user.name, phone: user.phone, profilePicture: user.profilePicture } });
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
};


// GET PRICING
export const getPricingSettings = async (req, res) => {
  let settings = await PricingSettings.findOne();
  if (!settings) settings = await PricingSettings.create({});
  res.json(settings);
};

// UPDATE PRICING
export const updatePricingSettings = async (req, res) => {
  const { basePrice, hourlyRate } = req.body;

  let settings = await PricingSettings.findOne();
  if (!settings) settings = await PricingSettings.create({});

  settings.basePrice = basePrice;
  settings.hourlyRate = hourlyRate;
  await settings.save();

  res.json({ message: "Pricing updated" });
};