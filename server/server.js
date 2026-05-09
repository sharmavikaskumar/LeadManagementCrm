const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db"); // ✅ import DB
const authRoutes=require("./routes/authRoutes");

const app = express();

// ✅ Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("CRM API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});