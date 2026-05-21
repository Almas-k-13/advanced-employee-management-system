const express = require("express");
const router = express.Router();

const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/",protect, createCompany);

router.get("/",protect, getAllCompanies);

router.get("/:id",protect, getCompanyById);

router.put("/:id",protect, updateCompany);

router.delete("/:id",protect, deleteCompany);

module.exports = router;