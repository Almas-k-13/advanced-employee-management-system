const bcrypt = require("bcryptjs");
const superAdmin = require("../models/superAdmin");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const nodemailer = require('nodemailer')



//Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "90d" });
};

const loginSuperAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        const user = await superAdmin.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
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


const registerSuperAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check if email already exists
        const userExists = await superAdmin.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const user = await superAdmin.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        console.log("Email from request:", email);

        const user = await superAdmin.findOne({ email });

        console.log("User found:", user);

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

        console.log("Password Reset OTP:", otp);
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

        const user = await superAdmin.findOne({ email: email.toLowerCase() });

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




module.exports = {
    loginSuperAdmin,
    registerSuperAdmin,
    forgotPassword,
    verifyOtp,
    resetPassword
}