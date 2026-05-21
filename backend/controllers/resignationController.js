const Resignation = require('./../models/resignation');


// ================= CREATE RESIGNATION =================
const createResignation = async (req, res) => {
  try {

    const { lastWorkingDate, reason } = req.body;

    const userId = req.user._id;
    const companyId = req.user.company_id;   //  ADD THIS

    const existing = await Resignation.findOne({ user_id: userId });

    if (existing) {
      return res.status(400).json({
        message: "You already submitted resignation"
      });
    }

    const resignation = await Resignation.create({
      user_id: userId,
      company_id: companyId,   //  ADD THIS
      lastWorkingDate,
      reason,
      status: "Pending"
    });

    res.json({
      message: "Resignation submitted",
      resignation
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};



// ================= GET ALL RESIGNATIONS =================
const getAllResignations = async (req, res) => {
  try {

    const role = req.user.role.role;
    const userId = req.user._id;

    let resignations;

    if (role === "Admin" || role === "Manager") {

      resignations = await Resignation.find()
        .populate("user_id", "name email")
        .sort({ createdAt: -1 });

    } else {

      resignations = await Resignation.find({
        user_id: userId
      })
        .populate("user_id", "name email")
        .sort({ createdAt: -1 });

    }

    res.json({
      resignations
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};



// ================= UPDATE STATUS (Approve / Reject) =================
const updateResignationStatus = async (req, res) => {

  try {

    const role = req.user.role.role;

    if (role !== "Admin") {
      return res.status(403).json({
        message: "Only admin can update status"
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const resignation = await Resignation.findById(id);

    if (!resignation) {
      return res.status(404).json({
        message: "Resignation not found"
      });
    }

    resignation.status = status;

    await resignation.save();

    res.json({
      message: "Status updated successfully",
      resignation
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



module.exports = {
  createResignation,
  getAllResignations,
  updateResignationStatus
};