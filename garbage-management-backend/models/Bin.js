const mongoose = require("mongoose");

const BinSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true, // Ensure type is present
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (val) {
          return val.length === 2;
        },
        message: "Coordinates must be an array of [longitude, latitude]",
      },
    },
  },
  zone: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  currentLevel: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ["empty", "half-full", "full", "overflow", "maintenance"],
    default: "empty",
  },
  type: {
    type: String,
    enum: ["general", "recyclable", "organic", "hazardous"],
    default: "general",
  },
  lastCollectedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Geospatial index for location
BinSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Bin", BinSchema);
