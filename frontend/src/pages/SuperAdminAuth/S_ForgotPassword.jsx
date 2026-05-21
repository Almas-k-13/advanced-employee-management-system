import { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const S_ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
  e.preventDefault();

if (!email) {
  setError("Email is required");
  return;
}

const emailRegex = /\S+@\S+\.\S+/;

if (!emailRegex.test(email)) {
  setError("Enter valid email address");
  return;
}

  setError("");

  try {
    const response = await axiosInstance.post(
      API_PATHS.SUPERADMINAUTH.FORGOT_PASSWORD,
      { email }
    );

    alert(response.data.message);

    // OTP verification page par redirect
    navigate("/superadmin/verify-otp", {
      state: { email }
    });

  } catch (error) {
    if (error.response && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("Something went wrong");
    }
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

       <form onSubmit={handleForgotPassword}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
          />
          {error && <p className="text-red-500 text-xs pb-2">{error}</p>}
          <button
            className="btn-primary"
            type="submit"
          >
            Send OTP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            <a
              href="/superadmin/login"
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

export default S_ForgotPassword;