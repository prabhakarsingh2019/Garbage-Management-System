const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");
const { protect, authorize } = require("../middleware/auth");

// Public routes with auth protection
router.get("/", protect, routeController.getAllRoutes);
router.get("/driver/:driverId", protect, routeController.getDriverRoutes);
router.get("/:id", protect, routeController.getRoute); // Added this line for single route

// Admin-only routes
router.post("/", protect, authorize("admin"), routeController.createRoute);
router.put("/:id/status", protect, routeController.updateRouteStatus);
router.delete("/:id", protect, authorize("admin"), routeController.deleteRoute);

module.exports = router;
