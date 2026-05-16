const Lead = require("../models/Lead");

const getDashboardStats = async (req, res) => {
  try {

    const totalLeads = await Lead.countDocuments({
      createdBy: req.user.id,
    });

    const newLeads = await Lead.countDocuments({
      createdBy: req.user.id,
      status: "new",
    });

    const contactedLeads = await Lead.countDocuments({
      createdBy: req.user.id,
      status: "contacted",
    });

    const closedLeads = await Lead.countDocuments({
      createdBy: req.user.id,
      status: "closed",
    });

    const recentLeads = await Lead.find({
      createdBy: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        closedLeads,
      },

      recentLeads,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};