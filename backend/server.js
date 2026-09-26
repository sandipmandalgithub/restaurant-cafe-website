const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const menuRoutes = require("./routes/menuRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Restaurant Café API is running successfully!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
