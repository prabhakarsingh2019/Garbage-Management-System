const mongoose = require("mongoose");
const Route = require("../models/Route");
const Bin = require("../models/Bin");
const User = require("../models/User"); // Ensure this is required

// @desc Get all routes (Admin)
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("driverId", "username email")
      .populate("binIds", "location zone status");

    res.status(200).json(routes);
  } catch (error) {
    console.error("Get All Routes Error:", error.message);
    res.status(500).json({ message: "Server error while fetching routes" });
  }
};

// @desc Get routes assigned to a specific driver
exports.getDriverRoutes = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid driver ID" });
    }

    const routes = await Route.find({ driverId })
      .populate("driverId", "username email")
      .populate("binIds", "location zone status");

    res.status(200).json(routes);
  } catch (error) {
    console.error("Get Driver Routes Error:", error.message);
    res
      .status(500)
      .json({ message: "Server error while fetching driver routes" });
  }
};
// @desc Get a single route by ID
exports.getRoute = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const route = await Route.findById(id)
      .populate("driverId", "username email")
      .populate("binIds", "location zone status");

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json(route);
  } catch (error) {
    console.error("Get Route Error:", error.message);
    res.status(500).json({ message: "Server error while fetching route" });
  }
};
// @desc Create a new route (Admin only)
exports.createRoute = async (req, res) => {
  try {
    const { driverId, binIds, date, estimatedDuration, distance } = req.body;

    // Validate inputs
    if (!driverId || !binIds?.length || !date) {
      return res
        .status(400)
        .json({ message: "Missing required route details" });
    }

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid driver ID" });
    }

    const driverExists = await User.findById(driverId);
    if (!driverExists) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const validBins = await Bin.find({ _id: { $in: binIds } });
    if (validBins.length !== binIds.length) {
      return res.status(400).json({ message: "One or more bins not found" });
    }

    // Simulate optimization (placeholder)
    const optimizedBinIds = [...binIds];

    const route = new Route({
      driverId,
      binIds: optimizedBinIds,
      date,
      estimatedDuration,
      distance,
      status: "pending",
    });

    await route.save();
    res.status(201).json(route);
  } catch (error) {
    console.error("Create Route Error:", error.message);
    res.status(500).json({ message: "Server error while creating route" });
  }
};

// @desc Update route status (Admin or Driver)
exports.updateRouteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.status = status;
    await route.save();

    res.status(200).json(route);
  } catch (error) {
    console.error("Update Route Status Error:", error.message);
    res
      .status(500)
      .json({ message: "Server error while updating route status" });
  }
};

// @desc Delete a route (Admin only)
exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    await route.deleteOne();
    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Delete Route Error:", error.message);
    res.status(500).json({ message: "Server error while deleting route" });
  }
};
