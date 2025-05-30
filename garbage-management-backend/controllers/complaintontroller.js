const Complaint = require("../models/Complaint");
const Bin = require("../models/Bin");

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Normal users)
exports.createComplaint = async (req, res) => {
  try {
    const { binId, complaintText } = req.body;
    const userId = req.user.id;

    // Check if bin exists
    const bin = await Bin.findById(binId);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    const complaint = await Complaint.create({
      userId,
      binId,
      complaintText,
    });

    res
      .status(201)
      .json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all complaints (Admin view)
// @route   GET /api/complaints
// @access  Private (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("binId", "location");

    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user's own complaints
// @route   GET /api/complaints/my
// @access  Private (User)
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).populate(
      "binId",
      "location"
    );
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update complaint status (Admin only)
// @route   PATCH /api/complaints/:id/status
// @access  Private (Admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ message: "Complaint status updated", complaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};
