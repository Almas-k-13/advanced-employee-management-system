import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect } from "react";

const S_ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();
const location = useLocation();

const email = location.state?.email;

useEffect(() => {
  if (!email) {
    navigate("/superadmin/forgotpassword");
  }
}, [email, navigate]);

const handleResetPassword = async (e) => {
  e.preventDefault();

  if (!newPassword || !confirmPassword) {
    setError("All fields are required");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setError("");

  try {
    const response = await axiosInstance.post(
      API_PATHS.SUPERADMINAUTH.RESET_PASSWORD,
      {
        email,
        newPassword,
        confirmPassword,
      }
    );

    alert(response.data.message);

    // Login page par redirect
    navigate("/superadmin/login");

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
          Change Password
        </h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Create a new strong password
        </p>

        <form onSubmit={handleResetPassword}>

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

          {error && <p className="text-red-500 text-xs pb-2">{error}</p>}
          <button
            className="btn-primary"
            type="submit"
          >
            Update Password
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            <Link
              className="font-medium text-primary underline"
              to="/superadmin/login"
            >
              Back To Login
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  );
};

export default S_ResetPassword;