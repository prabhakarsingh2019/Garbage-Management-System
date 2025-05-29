const mongoose = require("mongoose");

const CollectionRecordSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  binId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bin",
    required: true,
  },
  collectedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  statusBeforeCollection: {
    type: String,
    enum: ["empty", "half-full", "full", "overflow", "maintenance"],
  },
});

module.exports = mongoose.model("CollectionRecord", CollectionRecordSchema);
