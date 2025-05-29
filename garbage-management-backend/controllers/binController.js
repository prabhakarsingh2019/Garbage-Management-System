const Bin = require("../models/Bin");

// Get all bins
exports.getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find();
    res.json(bins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get nearby bins
exports.getNearbyBins = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters

    const bins = await Bin.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    res.json(bins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get single bin
exports.getBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }
    res.json(bin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Create bin (Admin only)
exports.createBin = async (req, res) => {
  try {
    const { location, zone, capacity, type, status } = req.body;

    // Validate location object
    if (
      !location ||
      location.type !== "Point" ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      typeof location.coordinates[0] !== "number" ||
      typeof location.coordinates[1] !== "number"
    ) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    const bin = new Bin({
      location, // use the full object
      zone,
      capacity,
      type,
      status, // optional, may come from frontend
    });

    await bin.save();
    res.status(201).json(bin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update bin (Admin only)
exports.updateBin = async (req, res) => {
  try {
    const { longitude, latitude, zone, capacity, currentLevel, status, type } =
      req.body;

    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    if (longitude && latitude) {
      bin.location.coordinates = [longitude, latitude];
    }
    if (zone) bin.zone = zone;
    if (capacity) bin.capacity = capacity;
    if (currentLevel) bin.currentLevel = currentLevel;
    if (status) bin.status = status;
    if (type) bin.type = type;

    await bin.save();
    res.json(bin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete bin (Admin only)
exports.deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    await bin.remove();
    res.json({ message: "Bin removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
