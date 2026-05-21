const express = require("express");
const router = express.Router();
const { createRole, updateRole, getAllRoles, getRoleById } = require("../controllers/rolesController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/create",protect, createRole);
router.put("/update/:id",protect, updateRole);
router.get("/get-all",protect, getAllRoles);
router.get("/get/:id",protect, getRoleById);

module.exports = router;