const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    contactPersonName: {
      type: String,
      required: true
    },

    contactPersonPhone: {
      type: String,
      required: true
    },

    code: {
      type: String,
      required: true,
      unique: true
    },

    plan: {
      type: String,
      enum: ["Basic", "Pro", "Enterprise"],
      default: "Basic"
    },

    is_delete: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);