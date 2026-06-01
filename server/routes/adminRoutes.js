const express = require("express");

const Lead = require("../models/Lead");

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

const {getAdminAnalytics}=require("../controllers/adminController")

const router = express.Router();

router.get(
  "/leads",

  protect,

  authorizeRoles("admin"),

  async (req, res) => {
    const leads = await Lead.find().populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      data: leads,
    });
  },
);

router.get(
  "/analytics",
  protect,
  authorizeRoles("admin"),
  getAdminAnalytics
);


module.exports = router;
