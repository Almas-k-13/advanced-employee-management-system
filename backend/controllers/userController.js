const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Company = require("../models/Company")

// @desc Get all users (Admin only)
// @route GET /api/users/
// @access Private (Admin)
const getUsers = async (req, res) => {
    try {

        const currentUser = await User.findById(req.user._id)
            .populate("role");
        let users = [];

        // Admin → same company users
        if (currentUser.role && currentUser.role.role === "Admin") {

            users = await User.find({
                is_delete: false,
                company_id: req.user.company_id
            }).select("-password");

        } else {

            const tasks = await Task.find({
                assignedTo: req.user._id,
                company_id: req.user.company_id
            }).populate("assignedTo", "-password");

            const userMap = {};

            tasks.forEach(task => {
                task.assignedTo.forEach(user => {
                    userMap[user._id] = user;
                });
            });

            users = Object.values(userMap);
        }

        const usersWithTaskCount = await Promise.all(
            users.map(async (user) => {

                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending",
                    company_id: req.user.company_id
                });

                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress",
                    company_id: req.user.company_id
                });

                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed",
                    company_id: req.user.company_id
                });

                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks
                };

            })
        );

        res.json(usersWithTaskCount);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// @desc Get user by ID
// @route  GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
    try {

        const user = await User.findOne({
            _id: req.params.id,
            company_id: req.user.company_id
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const createUser = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            department,
            salary,
            role,
            status
        } = req.body;

        if (!name || !email || !department || !salary || !role) {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        // company wise email check
        const existingUser = await User.findOne({
            email,
            company_id: req.user.company_id
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists in this company"
            });
        }

        // image upload
        let profileImageUrl = null;

        if (req.file) {
            profileImageUrl =
                `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const user = await User.create({
            name,
            email,
            password: null,
            company_id: req.user.company_id,
            phone,
            department,
            salary,
            role,
            status,
            profileImageUrl

        });

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const inviteUser = async (req, res) => {
    try {

        const user = await User.findOne({
            _id: req.params.id,
            company_id: req.user.company_id
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isInvited) {
            return res.status(400).json({
                message: "User already invited"
            });
        }

        // Generate password
        const plainPassword = crypto
            .randomBytes(4)
            .toString("hex")
            .slice(0, 6);

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        user.password = hashedPassword;
        user.isInvited = true;

        await user.save();
        const company = await Company.findById(user.company_id);

        // Send Email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Your Account Has Been Created - Employee Management System",
            html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">

          <table width="500" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

            <tr>
              <td style="text-align:center; padding-bottom:20px;">
                <h2 style="margin:0; color:#1f2937;">
                  Welcome to Employee Management System
                </h2>
              </td>
            </tr>

            <tr>
              <td style="padding:10px 0; color:#374151;">
                Hello <b>${user.name}</b>,
              </td>
            </tr>

            <tr>
              <td style="padding:10px 0; color:#4b5563;">
                Your account has been created successfully. Below are your login details:
              </td>
            </tr>

            <tr>
              <td style="padding:15px 0;">
                <table width="100%" style="border-collapse:collapse;">

                  <tr>
                    <td style="padding:8px; border:1px solid #e5e7eb;"><b>Company Name</b></td>
                    <td style="padding:8px; border:1px solid #e5e7eb;">${company.name}</td>
                  </tr>

                  <tr>
                    <td style="padding:8px; border:1px solid #e5e7eb;"><b>Company Code</b></td>
                    <td style="padding:8px; border:1px solid #e5e7eb;">${company.code}</td>
                  </tr>

                  <tr>
                    <td style="padding:8px; border:1px solid #e5e7eb;"><b>Email</b></td>
                    <td style="padding:8px; border:1px solid #e5e7eb;">${user.email}</td>
                  </tr>

                  <tr>
                    <td style="padding:8px; border:1px solid #e5e7eb;"><b>Temporary Password</b></td>
                    <td style="padding:8px; border:1px solid #e5e7eb;">${plainPassword}</td>
                  </tr>

                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 0; text-align:center;">
                <a href="http://localhost:5173/login"
                   style="background:#2563eb; color:#ffffff; padding:10px 20px; border-radius:5px; text-decoration:none;">
                   Login to your account
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px; color:#6b7280; font-size:13px;">
                For security reasons, please login and change your password after first login.
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px; color:#6b7280; font-size:13px;">
                Regards,<br/>
                <b>Employee Management System</b>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `
        });

        res.json({
            message: "Invitation sent successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            company_id: req.user.company_id
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const {
            name,
            email,
            phone,
            department,
            salary,
            role,
            status
        } = req.body;

        // Update fields if provided
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.department = department || user.department;
        user.salary = salary || user.salary;
        user.role = role || user.role;
        user.status = status || user.status;

        // Image update
        if (req.file) {
            user.profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        await user.save();

        res.json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            company_id: req.user.company_id
        });
        // if (user.role.role === "Admin") {
        //     return res.status(400).json({ message: "Admin cannot be deleted" });
        // }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.is_delete = true;
        await user.save();

        res.json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createUser, getUsers, getUserById, inviteUser, updateUser, deleteUser };