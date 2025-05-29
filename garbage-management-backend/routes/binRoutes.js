const express = require("express");
const router = express.Router();
const binController = require("../controllers/binController");
const { protect, authorize } = require("../middleware/auth");

// Public routes
router.get("/", binController.getAllBins);
router.get("/nearby", binController.getNearbyBins);
router.get("/:id", binController.getBin);

// Admin-only routes
router.post("/", protect, authorize("admin"), binController.createBin);
router.put("/:id", protect, authorize("admin"), binController.updateBin);
router.delete("/:id", protect, authorize("admin"), binController.deleteBin);

module.exports = router;
