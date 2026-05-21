const mongoose = require("mongoose");

const SuperAdminSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    // company_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Company",

    // },

    // company_name: {
    //     type: String,

    // },

    // companyCode: {
    //     type: String,

    //     unique: true
    // },

    phone: {
        type: String
    },

    profileImageUrl: {
        type: String,
        default: null
    },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roles"
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    is_delete: {
        type: Boolean,
        default: false
    },

    isInvited: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", SuperAdminSchema);