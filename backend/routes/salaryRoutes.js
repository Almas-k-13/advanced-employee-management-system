const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

const { getSalaryList } = require("../controllers/salaryController");
const checkPlanAccess = require("../middlewares/checkPlanAccess");

router.get("/", protect,checkPlanAccess("salary"),getSalaryList);

module.exports = router;