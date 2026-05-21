import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from '../../context/userContext';


const S_Login = () => {

  const [email, setEmail] = useState("kureshialmas805@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // if (companyCode.length !== 6) {
    //   setError("Company Code must be 6 digits");
    //   return;
    // } 

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      setError("Enter valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");

    try {

      const response = await axiosInstance.post(
        API_PATHS.SUPERADMINAUTH.LOGIN,
        {
          email,
          password,
        }
      );

      updateUser(response.data);

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/superadmin/dashboard");
      }

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

        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your login details
        </p>

        <form onSubmit={handleLogin}>

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="admin@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Enter password"
            type="password"
          />

          {error && (
            <p className="text-red-500 text-xs pb-2">{error}</p>
          )}

          <button className="btn-primary mt-3" type="submit">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            <Link
              className="font-medium text-primary underline"
              to="/superadmin/forgotpassword"
            >
              Forgot Password
            </Link>
          </p>
          <p className="text-[13px] text-slate-800 mt-3 text-center">
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer underline text-primary"
            >
              Back to Home
            </span>
          </p>

        </form>

      </div>
    </AuthLayout>
  );
};

export default S_Login;