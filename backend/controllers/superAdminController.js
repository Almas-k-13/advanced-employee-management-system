const SuperAdmin = require("../models/superAdmin");

const createSuperAdmin = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            phone,
            role,
            company_id,
            status
        } = req.body;

        if (!name || !email || !password || !role || !company_id) {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        const existingUser = await SuperAdmin.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        let profileImageUrl = null;

        if (req.file) {
            profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const user = await SuperAdmin.create({
            name,
            email,
            password,
            phone,
            role,
            company_id,
            status,
            profileImageUrl
        });

        res.status(201).json({
            message: "SuperAdmin created successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


const getSuperAdmins = async (req, res) => {
    try {

        const { company_id } = req.params;

        const users = await SuperAdmin.find({
            company_id,
            is_delete: false
        }).populate("role");

        res.status(200).json({
            message: "SuperAdmins fetched successfully",
            users
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const getSuperAdminById = async (req, res) => {

    try {

        const admin = await SuperAdmin.findOne({
            //   email: "superadmin@gmail.com",
            email: "kureshialmas805@gmail.com",
            is_delete: false
        }).populate("role");

        if (!admin) {
            return res.status(404).json({
                message: "Super Admin not found"
            });
        }

        res.status(200).json({
            user: admin
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};

const updateSuperAdmin = async (req, res) => {

    try {

        const { id } = req.params;

        const updateData = req.body;

        if (req.file) {
            updateData.profileImageUrl =
                `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const user = await SuperAdmin.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "SuperAdmin not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};

const deleteSuperAdmin = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await SuperAdmin.findByIdAndUpdate(
            id,
            { is_delete: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "SuperAdmin not found"
            });
        }

        res.status(200).json({
            message: "SuperAdmin deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



module.exports = {
    createSuperAdmin,
    getSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin
};