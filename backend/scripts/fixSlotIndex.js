import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixSlotIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("slots");

    // Get all indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Drop the old slotNumber_1 unique index if it exists
    try {
      await collection.dropIndex("slotNumber_1");
      console.log("✅ Dropped old slotNumber_1 index");
    } catch (error) {
      console.log("ℹ️  slotNumber_1 index doesn't exist or already dropped");
    }

    // Ensure the compound index exists
    await collection.createIndex(
      { parkingArea: 1, floor: 1, slotNumber: 1 },
      { unique: true }
    );
    console.log("✅ Created compound index: parkingArea_1_floor_1_slotNumber_1");

    console.log("\n✅ Index fix completed successfully!");
    console.log("You can now create slots with the same slot number on different floors/parking areas.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing index:", error);
    process.exit(1);
  }
};

fixSlotIndex();