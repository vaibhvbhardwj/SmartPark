import Slot from "../models/Slot.js";

// ADMIN: Bulk create slots for a parking area with floor support
export const bulkCreateSlots = async (req, res) => {
  try {
    const { parkingAreaId, floor, rows, columns, slotType, startingLetter } = req.body;

    if (!parkingAreaId || !floor || !rows || !columns) {
      return res.status(400).json({ message: "All fields required" });
    }

    const slots = [];
    const startChar = startingLetter ? startingLetter.charCodeAt(0) : 65; // Default 'A'

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        slots.push({
          slotNumber: `${String.fromCharCode(startChar + r)}${c + 1}`,
          parkingArea: parkingAreaId,
          floor: floor,
          slotType: slotType || "NORMAL",
          position: {
            row: r,
            column: c
          }
        });
      }
    }

    await Slot.insertMany(slots);

    res.status(201).json({ 
      message: `${slots.length} slots created successfully on floor ${floor}`,
      count: slots.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADMIN: Delete Parking Slot 
export const deleteSlotsByParkingArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    await Slot.deleteMany({ parkingArea: areaId });

    res.json({ message: "All slots deleted for this parking area" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// USER: Get slots by parking area and floor
export const getSlotsByParkingArea = async (req, res) => {
  try {
    const { parkingAreaId } = req.params;
    const { floor } = req.query;

    let query = { parkingArea: parkingAreaId };

    if (floor) {
      query.floor = parseInt(floor);
    }

    const slots = await Slot.find(query).sort({ floor: 1, slotNumber: 1 });

    // Group by floor
    const slotsByFloor = slots.reduce((acc, slot) => {
      const floorNum = slot.floor;
      if (!acc[floorNum]) {
        acc[floorNum] = [];
      }
      acc[floorNum].push(slot);
      return acc;
    }, {});

    res.json({
      slots,
      slotsByFloor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: update slot 
export const updateSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { slotType, status } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slotType && !["NORMAL", "EV", "HANDICAPPED", "RESERVED"].includes(slotType)) {
      return res.status(400).json({ message: "Invalid slot type" });
    }

    if (status && !["AVAILABLE", "BOOKED", "UNDER_MAINTENANCE"].includes(status)) {
      return res.status(400).json({ message: "Invalid slot status" });
    }

    if (slotType) slot.slotType = slotType;
    if (status) slot.status = status;
    
    await slot.save();

    res.json({
      message: "Slot updated successfully",
      slot
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Bulk update slot status (for maintenance)
export const bulkUpdateSlotStatus = async (req, res) => {
  try {
    const { slotIds, status } = req.body;

    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return res.status(400).json({ message: "Slot IDs array required" });
    }

    if (!["AVAILABLE", "UNDER_MAINTENANCE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await Slot.updateMany(
      { _id: { $in: slotIds }, status: { $ne: "BOOKED" } },
      { $set: { status } }
    );

    res.json({ message: `Slots updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


