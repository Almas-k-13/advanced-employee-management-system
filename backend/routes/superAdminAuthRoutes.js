const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const { loginSuperAdmin, registerSuperAdmin, forgotPassword, verifyOtp, resetPassword } = require('../controllers/superAdminAuthController');

const router = express.Router();

// superAdmin Routes

router.post("/loginsuperadmin", loginSuperAdmin);

router.post("/registersuperadmin", registerSuperAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);



router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "no file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename
        }`;
    res.status(200).json({ imageUrl });
});

module.exports = router;