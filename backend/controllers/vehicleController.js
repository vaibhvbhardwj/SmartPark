import Vehicle from "../models/Vehicle.js";

// ADD VEHICLE
export const addVehicle = async (req, res) => {
  const { vehicleNumber, vehicleType } = req.body;

  try {
    if (!vehicleNumber || !vehicleType) {
      return res.status(400).json({ message: "All fields required" });
    }

    const vehicle = await Vehicle.create({
      user: req.user.id,
      vehicleNumber,
      vehicleType
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY VEHICLES
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user.id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
