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
    res.status(201).json(lead);
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
      data: leads,
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
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // check ownership
    if (lead.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(500).json({
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
