import Rating from "../models/Rating.js";
import ParkingArea from "../models/ParkingArea.js";
import Booking from "../models/Booking.js";

// USER: Submit rating for parking area
export const submitRating = async (req, res) => {
  try {
    const { parkingAreaId, rating, review, bookingId } = req.body;

    if (!parkingAreaId || !rating) {
      return res.status(400).json({ message: "Parking area and rating required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Verify parking area exists
    const parkingArea = await ParkingArea.findById(parkingAreaId);
    if (!parkingArea) {
      return res.status(404).json({ message: "Parking area not found" });
    }

    // Check if user has already rated this parking area
    let existingRating = await Rating.findOne({
      user: req.user.id,
      parkingArea: parkingAreaId
    });

    if (existingRating) {
      // Update existing rating
      const oldRating = existingRating.rating;
      existingRating.rating = rating;
      existingRating.review = review || existingRating.review;
      if (bookingId) existingRating.booking = bookingId;
      await existingRating.save();

      // Update parking area average
      await updateParkingAreaRating(parkingAreaId, oldRating, rating);

      return res.json({
        message: "Rating updated successfully",
        rating: existingRating
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      user: req.user.id,
      parkingArea: parkingAreaId,
      rating,
      review,
      booking: bookingId
    });

    // Update parking area average rating
    parkingArea.totalRatings += 1;
    parkingArea.averageRating = 
      ((parkingArea.averageRating * (parkingArea.totalRatings - 1)) + rating) / 
      parkingArea.totalRatings;
    await parkingArea.save();

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: newRating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update parking area rating when rating is updated
async function updateParkingAreaRating(parkingAreaId, oldRating, newRating) {
  const parkingArea = await ParkingArea.findById(parkingAreaId);
  if (!parkingArea) return;

  // Recalculate average
  const totalRatings = parkingArea.totalRatings;
  const currentSum = parkingArea.averageRating * totalRatings;
  const newSum = currentSum - oldRating + newRating;
  parkingArea.averageRating = newSum / totalRatings;
  
  await parkingArea.save();
}

// Get ratings for parking area
export const getRatingsByParkingArea = async (req, res) => {
  try {
    const { parkingAreaId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const ratings = await Rating.find({ parkingArea: parkingAreaId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Rating.countDocuments({ parkingArea: parkingAreaId });

    res.json({
      ratings,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's rating for a parking area
export const getUserRatingForParkingArea = async (req, res) => {
  try {
    const { parkingAreaId } = req.params;

    const rating = await Rating.findOne({
      user: req.user.id,
      parkingArea: parkingAreaId
    });

    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};