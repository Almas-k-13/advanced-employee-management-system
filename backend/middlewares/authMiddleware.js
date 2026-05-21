const jwt = require('jsonwebtoken')
const User = require('../models/User');
const superAdmin = require('../models/superAdmin');

//Middleware to protect routes

// const protect = async (req, res, next) => {
//     try {
//         let token = req.headers.authorization;
//         if (token && token.startsWith("Bearer")) {
//             token = token.split(" ")[1]; //Extract token
//             const decode = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decode.id)
//                 .populate("role")
//                 .select("-password");
//             next();
//         } else {
//             res.status(401).json({ message: "NOt authorized, no token" });
//         }
//     } catch (error) {
//         res.status(401).json({ message: "token failed", error: error.message });
//     }
// };
// const protect = async (req, res, next) => {
//   try {

//     let token = req.headers.authorization;


//     if (token && token.startsWith("Bearer")) {

//       token = token.split(" ")[1];

//       const decode = jwt.verify(token, process.env.JWT_SECRET);

//       const user = await User.findById(decode.id)
//         .populate("role");

//       if (!user) {
//         return res.status(401).json({
//           message: "User not found"
//         });
//       }

//       req.user = user;

//       next();

//     } else {

//       return res.status(401).json({
//         message: "Not authorized, token missing"
//       });

//     }

//   } catch (error) {

//     return res.status(401).json({
//       message: "Token failed",
//       error: error.message
//     });

//   }
// };
const protect = async (req, res, next) => {
  try {

    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {

      token = token.split(" ")[1];

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      let user = await User.findById(decode.id).populate("role");

      if (!user) {
        user = await superAdmin.findById(decode.id);
      }

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      next();

    } else {

      return res.status(401).json({
        message: "Not authorized, token missing"
      });

    }

  } catch (error) {

    return res.status(401).json({
      message: "Token failed"
    });

  }
};

//Middleware for Admin- only access
const adminOnly = (req, res, next) => {
  console.log('req.user.role.role: ',req.user.role.role)
  if (req.user && req.user.role.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "access denied, admin only" });
  }
}

// const adminOnly = async (req, res, next) => {
//     try {
//         const user = await User.findById(req.user._id).populate("role");

//         if (!user.role || user.role.role !== "Admin") {
//             return res.status(403).json({
//                 message: "Access denied. Admin only."
//             });
//         }

//         next();

//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

module.exports = { protect, adminOnly }