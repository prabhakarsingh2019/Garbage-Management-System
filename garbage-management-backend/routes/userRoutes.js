const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// Admin-only route to get all users
router.get("/", protect, authorize("admin"), userController.getAllUsers);

// Protected routes for user actions
router.get("/:id", protect, userController.getUser);
router.put("/:id", protect, userController.updateUser);
router.delete("/:id", protect, authorize("admin"), userController.deleteUser);

module.exports = router;
