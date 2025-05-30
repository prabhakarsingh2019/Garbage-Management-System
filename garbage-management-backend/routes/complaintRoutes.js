const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Routes
router.post("/", protect, createComplaint); // Normal user submits complaint
router.get("/my", protect, getMyComplaints); // User sees own complaints
router.get("/", protect, adminOnly, getAllComplaints); // Admin views all
router.patch("/:id/status", protect, adminOnly, updateComplaintStatus); // Admin updates status

module.exports = router;
