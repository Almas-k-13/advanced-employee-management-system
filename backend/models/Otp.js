const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 300 } 
    //  5 minutes me OTP auto delete (TTL index)
});

module.exports = mongoose.model("Otp", OtpSchema);