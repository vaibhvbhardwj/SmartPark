import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";

// BOOK SLOT
export const bookSlot = async (req, res) => {
  const { slotId, vehicleId } = req.body;

  try {
    const slot = await Slot.findById(slotId);
    if (!slot || slot.status === "BOOKED") {
      return res.status(400).json({ message: "Slot not available" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      vehicle: vehicleId,
      slot: slotId
    });

    slot.status = "BOOKED";
    await slot.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER BOOKINGS
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("vehicle", "vehicleNumber")
      .populate("slot", "slotNumber");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const releaseSlot = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("slot");

    if (!booking || booking.status === "COMPLETED") {
      return res.status(400).json({ message: "Invalid booking" });
    }

    const endTime = new Date();
    const durationMs = endTime - booking.startTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

    const basePrice = 50;
    const hourlyRate = 100;

    const totalAmount = basePrice + durationHours * hourlyRate;

    booking.endTime = endTime;
    booking.totalAmount = totalAmount;
    booking.status = "COMPLETED";
    await booking.save();

    booking.slot.status = "AVAILABLE";
    await booking.slot.save();

    res.json({
      message: "Slot released successfully",
      totalAmount,
      durationHours
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
