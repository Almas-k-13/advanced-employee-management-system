const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  clockIn,
  getClockList,
  getClockByDocId,
  deleteClockByDocId,
} = require("../controllers/ClockController");
const checkPlanAccess = require("../middlewares/checkPlanAccess");

router.post("/",protect, clockIn);
router.get("/",protect,checkPlanAccess("attendance"), getClockList);
router.get("/:id",protect, getClockByDocId);
router.delete("/:id",protect, deleteClockByDocId);

module.exports = router;