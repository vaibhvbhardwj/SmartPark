import Razorpay from "razorpay";
import Booking from "../models/Booking.js";
import crypto from "crypto";

// Create Razorpay order for booking
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret"
    });

    const amount = booking.totalAmount || booking.estimatedAmount;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId,
        userId: req.user.id
      }
    });

    // Save order ID to booking
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy"
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: "Payment order creation failed" });
  }
};

// Verify payment signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Generate signature for verification
    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // For development, allow test payments
    const isTestMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === "rzp_test_dummy";
    
    if (razorpay_signature === generated_signature || isTestMode) {
      // Payment verified
      booking.paymentStatus = "PAID";
      booking.razorpayPaymentId = razorpay_payment_id;
      await booking.save();

      res.json({
        message: "Payment verified successfully",
        booking
      });
    } else {
      booking.paymentStatus = "FAILED";
      await booking.save();
      
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// Mock payment for testing (without actual Razorpay)
export const mockPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Simulate successful payment
    booking.paymentStatus = "PAID";
    booking.razorpayOrderId = `mock_order_${Date.now()}`;
    booking.razorpayPaymentId = `mock_pay_${Date.now()}`;
    await booking.save();

    res.json({
      message: "Mock payment successful",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};