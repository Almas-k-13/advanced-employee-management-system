const express = require('express');
const { getSuperAdminDashboard } = require('../controllers/superAdminDashboardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// superAdmin Routes
router.get("/dashboard",protect, getSuperAdminDashboard);

module.exports = router;


