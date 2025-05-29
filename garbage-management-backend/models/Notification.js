const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["alert", "reminder", "info", "warning"],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: String,
    enum: ["bin", "route", "collection", "user"],
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
