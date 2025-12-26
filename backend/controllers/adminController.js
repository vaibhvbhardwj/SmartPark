import Slot from "../models/Slot.js";
import Booking from "../models/Booking.js";

// CREATE SLOT (ADMIN)
export const createSlot = async (req, res) => {
  const { slotNumber } = req.body;

  try {
    const exists = await Slot.findOne({ slotNumber });
    if (exists) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    const slot = await Slot.create({ slotNumber });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VIEW ALL BOOKINGS (ADMIN)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber")
      .populate("slot", "slotNumber");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
