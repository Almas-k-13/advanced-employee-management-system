const Company = require("../models/Company");
const User = require("../models/User");
const generateCompanyCode = require("../utils/generateCompanyCode");
const adminRole = require("../utils/Roles/adminRole");
const employeeRole = require("../utils/Roles/employeeRole");
const hrRole = require("../utils/Roles/hrRole");
const managerRole = require("../utils/Roles/managerRole");
const nodemailer = require("nodemailer");
const Role = require('./../models/Roles')
const bcrypt = require("bcryptjs");


// const createCompany = async (req, res) => {


//   try {

//     const companyCode = await generateCompanyCode();

//     const company = await Company.create({
//       ...req.body,
//       code: companyCode,
//     });

// // role save
//     // company._id
//     //  4 roles

//     // user save
//     // c id
//     // user email
//     // link->http://localhost:5173/login
//     res.json({
//       message: "Company created successfully",
//       company
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });

//   }

// };







// GET ALL COMPANIES

const createCompany = async (req, res) => {
  try {

    const { user, ...companyData } = req.body;

    if (!user || !user.email || !user.name) {
      return res.status(400).json({
        message: "Admin user details are required"
      });
    }

    const companyCode = await generateCompanyCode();

    const company = await Company.create({
      ...companyData,
      code: companyCode
    });

    const roles = await Role.insertMany([
      { ...adminRole, company_id: company._id },
      { ...managerRole, company_id: company._id },
      { ...hrRole, company_id: company._id },
      { ...employeeRole, company_id: company._id }
    ]);

    const admin = roles.find(r => r.role === "Admin");

    if (!admin) {
      return res.status(400).json({
        message: "Admin role not found"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create admin user
    const newUser = await User.create({
      name: user.name,
      email: user.email,
      company_id: company._id,
      password: hashedPassword,
      role: admin._id,
      department: "IT",
      salary: 0,
      status: "Active"
    });

    // Email transporter
    let smtpoption = {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    const transporter = nodemailer.createTransport(smtpoption);

    // Email HTML
    let html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; background:#f4f6f9; padding:20px;">

<div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:8px">

<h2 style="color:#2563eb">Welcome to EMS</h2>

<p>Your company account has been created successfully.</p>

<hr/>

<p><b>Company Name:</b> ${company.name}</p>
<p><b>Company Code:</b> ${company.code}</p>

<br/>

<p><b>Admin Login Details</b></p>

<p>Email : ${newUser.email}</p>
<p>Password : ${user.password}</p>

<br/>

<a href="http://localhost:5173/login"
style="padding:10px 18px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
Login Now
</a>

</div>

</body>
</html>
`;

    // Send email
    await transporter.sendMail({
      from: `"EMS System" <${process.env.SMTP_USER}>`,
      to: newUser.email,
      subject: "Your EMS Company Account Created",
      html: html
    });

    res.json({
      message: "Company created successfully",
      company,
      adminUser: newUser
    });

  } catch (error) {

    console.log("Create Company Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};
const getAllCompanies = async (req, res) => {
  try {

    const companies = await Company.find({ is_delete: false });

    res.json(companies);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};


// GET COMPANY BY ID
const getCompanyById = async (req, res) => {
  try {

    const company = await Company.findById(req.params.id);

    res.json(company);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};


// UPDATE COMPANY
const updateCompany = async (req, res) => {
  try {

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Company updated successfully",
      company
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};


// DELETE COMPANY (SOFT DELETE)
const deleteCompany = async (req, res) => {
  try {

    await Company.findByIdAndUpdate(req.params.id, {
      is_delete: true
    });

    res.json({
      message: "Company deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};


module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};