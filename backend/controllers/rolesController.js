const Role = require('./../models/Roles')
const mongoose = require("mongoose");

const createRole = async (req, res) => {
  try {
    const { role, sequence, permissions, is_delete } = req.body;

    if (!role || !sequence || !permissions) {
      return res.status(400).json({
        message: "Role, sequence and permissions are required"
      });
    }

    // Check duplicate role
    const existingRole = await Role.findOne({
      role,
      company_id: req.user.company_id
    });

    if (existingRole) {
      return res.status(400).json({
        message: "Role already exists"
      });
    }

    const newRole = await Role.create({
      role,
      sequence,
      permissions,
      company_id: req.user.company_id,
      is_delete: is_delete || false
    });

    res.status(201).json({
      message: "Role created successfully",
      role: newRole
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, sequence, permissions, is_delete } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Role ID is required"
      });
    }

    const existingRole = await Role.findOne({
      _id: id,
      company_id: req.user.company_id
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    // If role name changing → check duplicate
    if (role && role !== existingRole.role) {
      const duplicate = await Role.findOne({
        role,
        company_id: req.user.company_id
      });
      if (duplicate) {
        return res.status(400).json({
          message: "Role name already exists"
        });
      }
    }

    // Update fields
    existingRole.role = role || existingRole.role;
    existingRole.sequence = sequence || existingRole.sequence;
    existingRole.permissions = permissions || existingRole.permissions;
    existingRole.is_delete =
      typeof is_delete === "boolean"
        ? is_delete
        : existingRole.is_delete;

    await existingRole.save();

    res.status(200).json({
      message: "Role updated successfully",
      role: existingRole
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getAllRoles = async (req, res) => {
  try {

    
    const roles = await Role.find({
      is_delete: false,
      // company_id: req.user.company_id
      company_id: new mongoose.Types.ObjectId(req.user.company_id)
    })
      .sort({ sequence: 1 });
      // console.log("ROLES FROM DB:", roles);
//       console.log("USER:", req.user);
// console.log("USER COMPANY ID:", req.user.company_id);
// console.log("TYPE:", typeof req.user.company_id);


    res.status(200).json({
      message: "Roles fetched successfully",
      count: roles.length,
      roles
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// const getAllRoles = async (req, res) => {
//   try {

//     const companyId = new mongoose.Types.ObjectId(req.user.company_id);

//     const roles = await Role.find({
//       is_delete: false,
//       company_id: companyId
//     }).sort({ sequence: 1 });

    

//     res.status(200).json({
//       message: "Roles fetched successfully",
//       count: roles.length,
//       roles
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

const getRoleById = async (req, res) => {
  try {

    const { id } = req.params;

    const role = await Role.findOne({
      _id: id,
      company_id: req.user.company_id
    });

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.status(200).json({
      message: "Role fetched successfully",
      role
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createRole,
  updateRole,
  getAllRoles,
  getRoleById
};
