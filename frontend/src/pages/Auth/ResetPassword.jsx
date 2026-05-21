import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ResetPassword = () => {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email;

  const navigate = useNavigate();

  const isValidPassword = newPassword.length >= 6;
  const isMatch = newPassword === confirmPassword;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPassword) {
      setError("Minimum 6 characters required");
      return;
    }

    if (!isMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axiosInstance.post(
        API_PATHS.AUTH.RESET_PASSWORD,
        {
          email,
          newPassword,
          confirmPassword
        }
      );

      // Success → redirect login
      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!email) {
      navigate("/forgotpassword");
    }
  }, [email, navigate]);

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">

        <h3 className="text-xl font-semibold text-black">
          Change Password
        </h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Create a new strong password
        </p>

        <form onSubmit={onSubmit}>

          <Input
            value={newPassword}
            onChange={({ target }) => setNewPassword(target.value)}
            label="New Password"
            placeholder="Enter new password"
            type="password"
          />

          <Input
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            label="Confirm Password"
            placeholder="Re-enter password"
            type="password"
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
            {loading ? "Updating..." : "Update Password"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            <Link
              className="font-medium text-primary underline"
              to="/login"
            >
              Back To Login
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;