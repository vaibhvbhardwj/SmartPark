import Slot from "../models/Slot.js";

// VIEW ALL SLOTS
export const getSlots = async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
