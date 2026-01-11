import Booking from "../models/Booking.js";

export const generateInvoice = async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId)
    .populate("user", "name email")
    .populate("vehicle", "vehicleNumber")
    .populate("slot", "slotNumber")
    .populate("parkingArea", "name");

  if (!booking || booking.status !== "COMPLETED") {
    return res.status(400).json({ message: "Invoice not available" });
  }

  const durationHours = Math.ceil(
    (booking.endTime - booking.startTime) / (1000 * 60 * 60)
  );

  res.json({
    invoiceId: `INV-${booking._id}`,
    user: booking.user,
    vehicle: booking.vehicle,
    slot: booking.slot,
    parkingArea: booking.parkingArea,
    durationHours,
    basePrice: 50,
    hourlyRate: 100,
    totalAmount: booking.totalAmount,
    date: booking.endTime
  });
};
