const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");
const { protect, authorize } = require("../middleware/auth");

// Routes
router.get("/", protect, collectionController.getAllCollections);
router.get(
  "/driver/:driverId",
  protect,
  collectionController.getDriverCollections
);
router.post(
  "/",
  protect,
  authorize("driver", "admin"),
  collectionController.createCollection
);

module.exports = router;
