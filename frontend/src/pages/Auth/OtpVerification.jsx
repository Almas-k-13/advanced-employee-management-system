import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const OtpVerification = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  const inputs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgotpassword");
    }
  }, [email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length < 4) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      setError("");

      await axiosInstance.post(
        API_PATHS.AUTH.VERIFY_OTP,
        {
          email,
          otp: Number(finalOtp)
        }
      );

      // Success → Reset Password page
      navigate("/ResetPassword", {
        state: { email }
      });

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid OTP"
      );
    }
  };

  const resendOtp = async () => {
    if (resendDisabled) return;

    try {
      await axiosInstance.post(
        API_PATHS.AUTH.FORGOT_PASSWORD,
        { email }
      );

      setCounter(30);
      setResendDisabled(true);
      setOtp(["", "", "", ""]);
      setError("");

    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          OTP Verification
        </h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter the 4-digit code sent to your email
        </p>

        <form onSubmit={onSubmit}>
          <div className="flex gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 text-center border rounded-md focus:ring-1 focus:ring-primary"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs pb-2.5">
              {error}
            </p>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Didn't receive?{" "}
            <span
              onClick={resendOtp}
              className={`cursor-pointer underline ${resendDisabled ? "text-gray-400" : "text-primary"
                }`}
            >
              Resend OTP {resendDisabled && `(${counter}s)`}
            </span>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default OtpVerification;