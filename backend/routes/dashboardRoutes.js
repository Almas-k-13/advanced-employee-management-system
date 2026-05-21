const express = require("express");
const router = express.Router();
const { getAttendanceStats } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/attendance-stats",protect, getAttendanceStats);

module.exports = router;