import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  binId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bin", // Assuming you have a Bin model
    required: true,
  },
  complaintText: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Complaint", complaintSchema);
