require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");
const binRoutes = require("./routes/binRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const routeRoutes = require("./routes/routeRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize app
const app = express();

// Middleware
app.use(
  cors({
    origin: [process.env.FRONT_WEB, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
