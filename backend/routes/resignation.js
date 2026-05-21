const express = require("express");
const router = express.Router();
const {
  createResignation,
  getAllResignations,
   updateResignationStatus,
} = require("../controllers/resignationController");
const { protect } = require("../middlewares/authMiddleware");
const checkPlanAccess = require("../middlewares/checkPlanAccess");

router.post("/create",protect, createResignation);
router.get("/get-all",protect,checkPlanAccess("resignation"), getAllResignations);
router.patch("/update-status/:id",protect,  updateResignationStatus);

module.exports = router;