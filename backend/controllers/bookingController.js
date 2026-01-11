import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";
import ParkingArea from "../models/ParkingArea.js";
import Vehicle from "../models/Vehicle.js";

// BOOK SLOT with estimated time and price
export const bookSlot = async (req, res) => {
  const { slotId, vehicleId, estimatedDuration } = req.body;

  try {
    // Validate inputs
    if (!slotId || !vehicleId || !estimatedDuration) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check slot availability
    const slot = await Slot.findById(slotId).populate("parkingArea");
    if (!slot || slot.status !== "AVAILABLE") {
      return res.status(400).json({ message: "Slot not available" });
    }

    // Check vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, user: req.user.id });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Calculate estimated amount
    const parkingArea = slot.parkingArea;
    const estimatedAmount = parkingArea.basePrice + (estimatedDuration * parkingArea.pricePerHour);
    const estimatedEndTime = new Date(Date.now() + estimatedDuration * 60 * 60 * 1000);

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      vehicle: vehicleId,
      slot: slotId,
      parkingArea: parkingArea._id,
      parkingAreaName: parkingArea.name,
      estimatedDuration,
      estimatedAmount,
      estimatedEndTime,
      paymentStatus: "PENDING"
    });

    // Mark slot as booked
    slot.status = "BOOKED";
    await slot.save();

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("vehicle", "vehicleNumber vehicleType")
      .populate("slot", "slotNumber floor slotType")
      .populate("parkingArea", "name address pricePerHour basePrice");

    res.status(201).json({
      message: "Slot booked successfully",
      booking: populatedBooking,
      estimatedAmount,
      razorpayOrderId: null // Will be generated in payment flow
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Get my bookings
export const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("vehicle", "vehicleNumber vehicleType")
      .populate("slot", "slotNumber floor slotType")
      .populate("parkingArea", "name address location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Get active booking
export const getActiveBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      user: req.user.id,
      status: "ACTIVE"
    })
      .populate("vehicle", "vehicleNumber vehicleType")
      .populate("slot", "slotNumber floor slotType")
      .populate("parkingArea", "name address location pricePerHour basePrice");

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Complete booking and calculate final amount
export const completeBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("slot parkingArea");

    if (!booking || booking.status !== "ACTIVE") {
      return res.status(400).json({ message: "Invalid or completed booking" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const actualEndTime = new Date();
    const durationMs = actualEndTime - booking.startTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Round up to nearest hour

    const parkingArea = booking.parkingArea;
    const totalAmount = parkingArea.basePrice + (durationHours * parkingArea.pricePerHour);

    booking.actualEndTime = actualEndTime;
    booking.duration = durationHours;
    booking.totalAmount = totalAmount;
    booking.status = "COMPLETED";
    await booking.save();

    // Release slot
    booking.slot.status = "AVAILABLE";
    await booking.slot.save();

    res.json({
      message: "Booking completed successfully",
      booking,
      totalAmount,
      duration: durationHours
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("slot");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "ACTIVE") {
      return res.status(400).json({ message: "Booking already completed or cancelled" });
    }

    // Release slot
    booking.slot.status = "AVAILABLE";
    await booking.slot.save();

    booking.status = "CANCELLED";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const { status, parkingAreaId } = req.query;

    let query = {};
    if (status) query.status = status;
    if (parkingAreaId) query.parkingArea = parkingAreaId;

    // If company admin, only show their company's bookings
    if (req.user.role === "company_admin") {
      const parkingAreas = await ParkingArea.find({ company: req.user.company }).select("_id");
      const areaIds = parkingAreas.map(area => area._id);
      query.parkingArea = { $in: areaIds };
    }

    const bookings = await Booking.find(query)
      .populate("user", "name email phone")
      .populate("vehicle", "vehicleNumber vehicleType")
      .populate("slot", "slotNumber floor")
      .populate("parkingArea", "name")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};