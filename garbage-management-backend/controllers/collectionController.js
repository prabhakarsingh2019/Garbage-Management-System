const CollectionRecord = require("../models/CollectionRecord");
const Bin = require("../models/Bin");

// Get all collection records
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await CollectionRecord.find()
      .populate("driverId", "username email")
      .populate("binId", "location zone status");
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get collections by driver
exports.getDriverCollections = async (req, res) => {
  try {
    const collections = await CollectionRecord.find({
      driverId: req.params.driverId,
    })
      .populate("driverId", "username email")
      .populate("binId", "location zone status");
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Create collection record
exports.createCollection = async (req, res) => {
  try {
    const { binId, notes, statusBeforeCollection } = req.body;

    // Check if bin exists
    const bin = await Bin.findById(binId);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    const collection = new CollectionRecord({
      driverId: req.user.id,
      binId,
      notes,
      statusBeforeCollection: statusBeforeCollection || bin.status,
    });

    // Update bin status to empty after collection
    bin.status = "empty";
    bin.currentLevel = 0;
    bin.lastCollectedAt = new Date();

    await Promise.all([collection.save(), bin.save()]);
    res.status(201).json(collection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
