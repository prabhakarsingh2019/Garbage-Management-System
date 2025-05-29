const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  binIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bin",
    },
  ],
  optimizedPath: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  estimatedDuration: {
    type: Number, // in minutes
  },
  distance: {
    type: Number, // in km
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Route", RouteSchema);
