const Company = require("../models/Company");
const Roles = require("../models/Roles");
const User = require("../models/User");

const getSuperAdminDashboard = async (req, res) => {
  try {

    const totalCompanies = await Company.countDocuments({
      is_delete: false
    });

    const adminRoles = await Roles.find({ role: "Admin" });
    const adminRoleIds = adminRoles.map(r => r._id);

    const totalAdmins = await User.countDocuments({
      role: { $in: adminRoleIds },
      is_delete: false
    });

    const companyEmployees = await User.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role"
        }
      },
      { $unwind: "$role" },

      {
        $match: {
          "role.role": "Employee",
          is_delete: false
        }
      },

      {
        $group: {
          _id: "$company_id",
          totalEmployees: { $sum: 1 }
        }
      },

      {
        $lookup: {
          from: "companies",
          localField: "_id",
          foreignField: "_id",
          as: "company"
        }
      },

      { $unwind: "$company" },

      {
        $match: {
          "company.is_delete": false
        }
      },

      {
        $project: {
          _id: 0,
          companyName: "$company.name",
          totalEmployees: 1
        }
      }
    ]);

    res.status(200).json({
      totalCompanies,
      totalAdmins,
      companyEmployees
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getSuperAdminDashboard
};