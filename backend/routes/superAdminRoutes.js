const express = require("express");
const router = express.Router();



const {
  getSuperAdminById,
  updateSuperAdmin
} = require("../controllers/superAdminController");
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");

// get profile
router.get("/profile",protect, getSuperAdminById);

// update profile + image upload
router.put("/:id", upload.single("profileImage"),protect, updateSuperAdmin);

module.exports = router;