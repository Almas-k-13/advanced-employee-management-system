const Clock = require("../models/Clock")
const User = require("../models/User");
const Task = require("../models/Task");
// ===============================
// CREATE / UPDATE CLOCK
// ===============================
const clockIn = async (req, res) => {
  try {
    const {
      id,
      user_id,
      task_id,
      in_time,
      out_time,
      description,
      location,
    } = req.body;

    // ===============================
    // 🔁 UPDATE CLOCK (STOP)
    // ===============================
    if (id) {
      const clock = await Clock.findOne({
        _id: id,
        company_id: req.user.company_id
      });

      if (!clock) {
        return res.status(404).json({
          status: false,
          message: "Clock record not found",
        });
      }

    const updateData = {};

if (typeof user_id === "string") {
  updateData.user_id = user_id;
}

if (typeof task_id === "string") {
  updateData.task_id = task_id;
}

if (typeof in_time === "number") {
  updateData.in_time = in_time;
}

if (typeof out_time === "number") {
  updateData.out_time = out_time;
}

if (typeof description === "string") {
  updateData.description = description;
}

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          status: false,
          message: "Nothing to update",
        });
      }

      await Clock.findByIdAndUpdate(id, updateData, { new: true });

      return res.json({
        status: true,
        message: "Clock Updated Successfully",
      });
    }

    // ===============================
    // 🟢 CREATE CLOCK (START)
    // ===============================
    if (!user_id || !task_id || !in_time) {
      return res.status(400).json({
        status: false,
        message: "user_id, task_id and in_time are required",
      });
    }

    const newClock = await Clock.create({
      user_id,
      task_id,
      company_id: req.user.company_id,
      in_time,
    out_time: typeof out_time === "number" ? out_time : 0,
      description: description || "",
      location: location || null,
    });

    return res.json({
      status: true,
      message: "Clock started successfully",
      data: newClock,
    });
  } catch (error) {
    console.error("CLOCK ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};


const getClockList = async (req, res) => {
  try {
    const clocks = await Clock.find({
      company_id: req.user.company_id,
    })

      .populate("user_id", "name email")
      .populate("task_id", "title")
      .sort({ created_at: -1 });

    

    const result = clocks.map((item) => ({
  id: item._id,
  user_id: item.user_id?._id,
  user_name: item.user_id?.name || "Unknown",
  task_id: item.task_id?._id,
  task_name: item.task_id?.title || "Unknown",
  in_time: item.in_time || 0,
  out_time: item.out_time || 0,
  description: item.description,
}));

    return res.json({
      status: true,
      data: result,
    });
  } catch (error) {
    console.error("Clock fetch error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const getClockByDocId = async (req, res) => {
  try {
    const { id } = req.params;

    const clock = await Clock.findOne({
      _id: id,
      company_id: req.user.company_id
    })
      .populate("user_id", "name email")
      .populate("task_id", "title");

    if (!clock) {
      return res.status(404).json({
        status: false,
        message: "Clock record not found",
      });
    }

    res.json({
      status: true,
      data: clock,
      message: "Clock Record Found",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const deleteClockByDocId = async (req, res) => {
  try {
    const { id } = req.params;

    const clock = await Clock.findOne({
      _id: id,
      company_id: req.user.company_id
    })

    if (!clock) {
      return res.status(404).json({
        status: false,
        message: "Clock record not found",
      });
    }

    await Clock.findByIdAndDelete(id);

    res.json({
      status: true,
      message: "Clock Record Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

module.exports = {
  clockIn,
  getClockList,
  getClockByDocId,
  deleteClockByDocId
}