const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    sequence: {
      type: Number,
      required: true
    },

    permissions: {
      type: Object,
      required: true
    },

    is_delete: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// compound unique index
RoleSchema.index({ role: 1, company_id: 1 }, { unique: true });

module.exports = mongoose.model("Roles", RoleSchema);