const Clock = require("../models/Clock");
const User = require("../models/User");

const getAttendanceStats = async (req, res) => {
  try {

    // ==========================
    // TODAY DATE RANGE
    // ==========================
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // ==========================
    // TOTAL USERS
    // ==========================
    const totalUsers = await User.countDocuments({
      status: "Active",
      company_id: req.user.company_id
    });

    // ==========================
    // TODAY PRESENT USERS
    // ==========================
    const todayPresent = await Clock.aggregate([
      {
        $match: {
          company_id: req.user.company_id,
          created_at: {
            $gte: startOfToday,
            $lte: endOfToday
          }
        }
      },
      {
        $group: {
          _id: "$user_id"
        }
      }
    ]);

    const presentCount = todayPresent.length;
    const absentCount = totalUsers - presentCount;

    // ==========================
    // LAST 7 DAYS PRESENT COUNT
    // ==========================
    const last7Days = await Clock.aggregate([
      {
        $match: {
          company_id: req.user.company_id,
          created_at: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created_at"
            }
          },
          present: { $addToSet: "$user_id" }
        }
      },
      {
        $project: {
          date: "$_id",
          presentCount: { $size: "$present" }
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.json({
      todayAttendance: {
        present: presentCount,
        absent: absentCount
      },
      last7DaysAttendance: last7Days
    });

  } catch (error) {

    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { getAttendanceStats };