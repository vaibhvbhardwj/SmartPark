import Slot from "../models/Slot.js";
import Booking from "../models/Booking.js";
import ParkingArea from "../models/ParkingArea.js";

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

export const getAdminStats = async (req, res) => {
  try {
    const totalAreas = await ParkingArea.countDocuments();

    const totalSlots = await Slot.countDocuments();

    const activeSessions = await Booking.countDocuments({
      status: "ACTIVE"
    });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: "COMPLETED" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({
      totalAreas,
      totalSlots,
      activeSessions,
      revenue: revenueAgg[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
