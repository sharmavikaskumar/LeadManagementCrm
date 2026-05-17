const { success } = require("zod");
const Lead = require("../models/Lead");
const { leadSchema } = require("../validations/leadValidation");

const createLead = async (req, res) => {
  try {
    // validate request
    const validatedData = leadSchema.parse(req.body);

    const lead = await Lead.create({
      ...validatedData,
      createdBy: req.user.id,
    });
    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const status = req.query.status || "";
    const skip = (page - 1) * limit;

    let filter = {
      createdBy: req.user.id,
    };

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (status) {
      filter.status = status;
    }

    // fetch leads
    const leads = await Lead.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    // total count
    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      leads: leads,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE LEAD
const updateLead = async (req, res) => {
  try {
    const validatedData = leadSchema.partial().parse(req.body);

    const updatedLead = await Lead.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      validatedData,
      {
        new: true,
      },
    );

    // if lead not found OR unauthorized
    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    // zod validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE LEAD
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // ownership check
    if (lead.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
};
