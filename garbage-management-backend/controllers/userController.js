const User = require("../models/User");
const mongoose = require("mongoose");

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get User Error:", err.message);
    res.status(500).json({ message: "Server error while fetching user" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, location, contactNumber } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow admins to change roles
    if (role && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to change roles" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (location) user.location = location;
    if (contactNumber) user.contactNumber = contactNumber;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await user.remove();
    res.json({ message: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
