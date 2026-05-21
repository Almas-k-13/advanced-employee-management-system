const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, createUser, inviteUser, updateUser, deleteUser } = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

// User Management Routes
router.get("/", protect, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get a specific user
router.post("/create",protect, upload.single("profileImage"), createUser);
router.post("/invite/:id", protect, inviteUser);
router.put(
  "/update/:id",
  protect,
  upload.single("profileImage"),
  updateUser
);
router.delete(
  "/delete/:id",
  protect,
  deleteUser
);

module.exports = router;