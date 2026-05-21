const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const Otp = require("../models/Otp.js");
const nodemailer = require('nodemailer')
const Company = require("../models/Company");
const superAdmin = require("../models/superAdmin.js");

//Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "90d" });

};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInvitedToken } = req.body;

        // check if user already exixst
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already Exists" });
        }

        // Determine user role : Admin if correct token is provided, otherwise Member
        let role = "member";
        if (
            adminInvitedToken &&
            adminInvitedToken == process.env.ADMIN_INVITED_TOKEN
        ) {
            role = "admin";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // return user data with jwt
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc Login user
// @route POST /api/auth/login
// @access Public
// pwd 123abc
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // const user = await User.findOne({ email });
//         const user = await User.findOne({ email }).populate("role");
//         if (!user) {
//             return res.status(401).json({ message: "Invalid Email or Password" });
//         }

//         // compare pwd
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid Email or Password" });
//         }

//         // Return user data with jwt
//         res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role.role,
//             profileImageUrl: user.profileImageUrl,
//             token: generateToken(user._id),
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


const loginUser = async (req, res) => {
    try {

        const { companyCode, email, password } = req.body;

        if (!companyCode || !email || !password) {
            return res.status(400).json({
                message: "Company Code, Email and Password are required"
            });
        }

        // company code format check
        const companyCodeRegex = /^EMS-\d{5,6}$/;

        if (!companyCodeRegex.test(companyCode)) {
            return res.status(400).json({
                message: "Invalid Company Code format"
            });
        }

        // Find company
        const company = await Company.findOne({ code: companyCode });

        if (!company) {
            return res.status(401).json({
                message: "Invalid Company Code"
            });
        }

        // Find user using company_id
        const user = await User.findOne({
            email,
            company_id: company._id
        }).populate("role");

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email, Password or Company Code"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        // Login success
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            companyCode: company.code,
            company_id: company._id,
            plan: company.plan,
            role: user.role ? user.role.role : null,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};


// @desc Get user profile
// @route GET /api/auth/profile
// @access Private (Requires jwt)
// const getUserProfile = async (req, res) => {
//     try {

//         const user = await User.findById(req.user._id)
//             .populate("role")
//             .select("-password");

//         const company = await Company.findById(user.company_id);


//         res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: {
//                 role: user.role?.role,
//                 permissions: user.role?.permissions
//             },
//             company_id: company._id,
//             plan: company.plan,
//             profileImageUrl: user.profileImageUrl
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };
const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
            .populate("role")
            .select("-password");

        // 🔴 Agar user nahi mila (matlab Super Admin hai)
        if (!user) {
            const admin = await superAdmin.findById(req.user._id).select("-password");

            return res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                profileImageUrl: admin.profileImageUrl
            });
        }

        const company = await Company.findById(user.company_id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: {
                role: user.role?.role,
                permissions: user.role?.permissions
            },
            company_id: company._id,
            plan: company.plan,
            profileImageUrl: user.profileImageUrl
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private (Requires jwt)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// intern@upgrowthinfotech.com
// UpGrowth1#
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: "Email not registered"
            });
        }

        // Generate 4 digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);

        // Delete old OTP if exists
        await Otp.deleteOne({ email: email.toLowerCase() });

        await Otp.create({
            email: email.toLowerCase(),
            otp,
            verified: false
        });

        // console.log("Password Reset OTP:", otp);
        let smtpoption = {
            host: process.env.SMTP_HOST,
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        }
        const transporter = nodemailer.createTransport(smtpoption)

        // let html=`otp is ${otp}.`
        let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        
        <table width="500" cellpadding="0" cellspacing="0" 
          style="background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

          <tr>
            <td style="text-align:center; padding-bottom:20px;">
              <h2 style="margin:0; color:#1f2937;">
                OTP for Login - ${otp}
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding:15px 0; color:#374151; font-size:14px;">
              Dear User,
            </td>
          </tr>

          <tr>
            <td style="padding:10px 0; color:#4b5563; font-size:15px;">
              <strong style="font-size:22px; letter-spacing:3px; color:#2563eb;">
                ${otp}
              </strong>
              is your one time password (OTP).
            </td>
          </tr>

          <tr>
            <td style="padding-top:10px; color:#6b7280; font-size:13px;">
              Please do not share this OTP with anyone.
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px; color:#6b7280; font-size:14px;">
              Regards,<br/>
              <strong>Employee Management System</strong>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

        const mail = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Forgot Password OPT',
            html: html
        })
        console.log(mail);

        res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: "Email not registered"
            });
        }

        const otpRecord = await Otp.findOne({ email: email.toLowerCase() });

        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP not generated or expired"
            });
        }

        if (Number(otp) !== Number(otpRecord.otp)) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        otpRecord.verified = true;
        await otpRecord.save();

        res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: "Email not registered"
            });
        }

        const otpRecord = await Otp.findOne({ email: email.toLowerCase() });

        if (!otpRecord || !otpRecord.verified) {
            return res.status(403).json({
                message: "OTP not verified"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        // Delete OTP after success
        await Otp.deleteOne({ email: email.toLowerCase() });

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getMe = async (req, res) => {

    const user = await User.findById(req.user._id).populate("role");

    const company = await Company.findById(user.company_id);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: company.plan,
        role: user.role ? user.role.role : null,
        company_id: company._id
    });

};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    verifyOtp,
    resetPassword,
    getMe
}