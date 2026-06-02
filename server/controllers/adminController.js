const Lead = require("../models/Lead");

const getAdminAnalytics = async (req, res) => {
  try {
    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    // Aggregation
    const analytics = await Lead.aggregate([
      {
        $group: {
          _id: "$createdBy",

          totalLeads: { $sum: 1 },

          new: {
            $sum: {
              $cond: [{ $eq: ["$status", "new"] }, 1, 0],
            },
          },

          contacted: {
            $sum: {
              $cond: [{ $eq: ["$status", "contacted"] }, 1, 0],
            },
          },

          qualified: {
            $sum: {
              $cond: [{ $eq: ["$status", "qualified"] }, 1, 0],
            },
          },

          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "closed"] }, 1, 0],
            },
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },

      {
        $unwind: "$employee",
      },

      {
        $project: {
          _id: 0,

          employeeName: "$employee.name",
          employeeEmail: "$employee.email",

          totalLeads: 1,
          new: 1,
          contacted: 1,
          qualified: 1,
          closed: 1,
        },
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ]);

    // Total Employees Count
    const totalEmployees = await Lead.aggregate([
      {
        $group: {
          _id: "$createdBy",
        },
      },
      {
        $count: "total",
      },
    ]);

    const total = totalEmployees[0]?.total || 0;

    res.status(200).json({
      success: true,

      currentPage: page,
      perPage: limit,

      totalEmployees: total,
      totalPages: Math.ceil(total / limit),

      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminAnalytics,
};