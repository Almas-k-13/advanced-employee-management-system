import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setError("Please enter valid email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.post(
        API_PATHS.AUTH.FORGOT_PASSWORD,
        { email }
      );

      if (response.data.message === "OTP sent successfully") {
        navigate("/OtpVerification", {
          state: { email }
        });
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Forgot Password
        </h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter your email to receive OTP
        </p>

        <form onSubmit={onSubmit}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
          />
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
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            <a
              href="/login"
              className="font-medium text-primary underline"
            >
              Back To Login
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;