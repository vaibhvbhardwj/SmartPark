import ParkingArea from "../models/ParkingArea.js";
import Company from "../models/Company.js";
import Slot from "../models/Slot.js";
import Rating from "../models/Rating.js";

// COMPANY ADMIN: Create parking area
export const createParkingArea = async (req, res) => {
  try {
    const {
      name,
      companyId,
      address,
      latitude,
      longitude,
      layoutType,
      totalFloors,
      pricePerHour,
      basePrice,
      amenities,
      operatingHours
    } = req.body;

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if user is authorized (company admin or super admin)
    if (req.user.role === "company_admin" && req.user.company.toString() !== companyId) {
      return res.status(403).json({ message: "Not authorized for this company" });
    }

    const parkingArea = await ParkingArea.create({
      name,
      company: companyId,
      address,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      layoutType: layoutType || "RECTANGULAR",
      totalFloors: totalFloors || 1,
      pricePerHour: pricePerHour || 50,
      basePrice: basePrice || 20,
      amenities: amenities || [],
      operatingHours: operatingHours || { open: "00:00", close: "23:59" }
    });

    res.status(201).json({
      message: "Parking area created successfully",
      parkingArea
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: Get nearby parking areas
export const getNearbyParkingAreas = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query; // maxDistance in meters

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const parkingAreas = await ParkingArea.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: "ACTIVE"
    })
      .populate("company", "name")
      .select("-__v");

    // Get available slots count for each parking area
    const areasWithSlots = await Promise.all(
      parkingAreas.map(async (area) => {
        const availableSlots = await Slot.countDocuments({
          parkingArea: area._id,
          status: "AVAILABLE"
        });

        const totalSlots = await Slot.countDocuments({
          parkingArea: area._id
        });

        return {
          ...area.toObject(),
          availableSlots,
          totalSlots,
          distance: calculateDistance(
            latitude,
            longitude,
            area.location.coordinates[1],
            area.location.coordinates[0]
          )
        };
      })
    );

    res.json(areasWithSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 1000) / 1000; // Round to 3 decimal places
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Get parking area details
export const getParkingAreaById = async (req, res) => {
  try {
    const parkingArea = await ParkingArea.findById(req.params.id)
      .populate("company", "name phone email");

    if (!parkingArea) {
      return res.status(404).json({ message: "Parking area not found" });
    }

    // Get slots count by floor
    const slotsByFloor = await Slot.aggregate([
      { $match: { parkingArea: parkingArea._id } },
      {
        $group: {
          _id: "$floor",
          total: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ["$status", "AVAILABLE"] }, 1, 0] }
          },
          booked: {
            $sum: { $cond: [{ $eq: ["$status", "BOOKED"] }, 1, 0] }
          },
          maintenance: {
            $sum: { $cond: [{ $eq: ["$status", "UNDER_MAINTENANCE"] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get recent ratings
    const ratings = await Rating.find({ parkingArea: parkingArea._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      ...parkingArea.toObject(),
      slotsByFloor,
      ratings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all parking areas (for admin)
export const getAllParkingAreas = async (req, res) => {
  try {
    const { companyId, status } = req.query;

    let query = {};
    
    if (companyId) {
      query.company = companyId;
    }

    if (status) {
      query.status = status;
    }

    // If company admin, only show their company's areas
    if (req.user.role === "company_admin") {
      query.company = req.user.company;
    }

    const parkingAreas = await ParkingArea.find(query)
      .populate("company", "name")
      .sort({ createdAt: -1 });

    res.json(parkingAreas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update parking area
export const updateParkingArea = async (req, res) => {
  try {
    const parkingArea = await ParkingArea.findById(req.params.id);

    if (!parkingArea) {
      return res.status(404).json({ message: "Parking area not found" });
    }

    // Check authorization
    if (req.user.role === "company_admin" && 
        req.user.company.toString() !== parkingArea.company.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      name,
      address,
      pricePerHour,
      basePrice,
      status,
      amenities,
      operatingHours
    } = req.body;

    if (name) parkingArea.name = name;
    if (address) parkingArea.address = address;
    if (pricePerHour) parkingArea.pricePerHour = pricePerHour;
    if (basePrice) parkingArea.basePrice = basePrice;
    if (status) parkingArea.status = status;
    if (amenities) parkingArea.amenities = amenities;
    if (operatingHours) parkingArea.operatingHours = operatingHours;

    await parkingArea.save();

    res.json({
      message: "Parking area updated successfully",
      parkingArea
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Make parking area live
export const makeParkingAreaLive = async (req, res) => {
  try {
    const parkingArea = await ParkingArea.findById(req.params.id);

    if (!parkingArea) {
      return res.status(404).json({ message: "Parking area not found" });
    }

    // Check if parking area has slots
    const slotsCount = await Slot.countDocuments({ parkingArea: parkingArea._id });
    
    if (slotsCount === 0) {
      return res.status(400).json({ 
        message: "Cannot make parking area live without slots" 
      });
    }

    parkingArea.status = "ACTIVE";
    await parkingArea.save();

    res.json({
      message: "Parking area is now live",
      parkingArea
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete parking area
export const deleteParkingArea = async (req, res) => {
  try {
    const parkingArea = await ParkingArea.findById(req.params.id);

    if (!parkingArea) {
      return res.status(404).json({ message: "Parking area not found" });
    }

    // Check authorization
    if (req.user.role === "company_admin" && 
        req.user.company.toString() !== parkingArea.company.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete all slots
    await Slot.deleteMany({ parkingArea: parkingArea._id });

    await ParkingArea.findByIdAndDelete(req.params.id);

    res.json({ message: "Parking area and associated slots deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};