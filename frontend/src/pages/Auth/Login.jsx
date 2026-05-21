import React, { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [companyCode, setCompanyCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate();

  // Handle Login Form Submit
  //   const handleLogin = async (e) => {
  //     e.preventDefault();

  //     if (!validateEmail(email)) {
  //       setError("Please enter a valid email address..");
  //       return;
  //     }
  //     if (companyCode.length < 5 || companyCode.length > 6) {
  //       setError("Company Code must be 5 or 6 digits");
  //       return;
  //     }

  //     if (!password) {
  //       setError("Please enter the password..");
  //       return;
  //     }

  //     setError("");

  //     // Login API Call
  //     try {
  //       const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
  //         companyCode: `EMS-${companyCode}`,
  //         email,
  //         password
  //       });
  //       console.log("LOGIN RESPONSE:", response.data);


  //       const { token, role } = response.data;

  //       // if (token) {
  //         localStorage.setItem("user", JSON.stringify(response.data));
  // localStorage.setItem("token", response.data.token);
  //         // localStorage.setItem("token", token);
  //         updateUser(response.data);

  //         //Redirect based on role
  //         // if (role === "admin") {
  //         //   navigate("/admin/dashboard");
  //         // } else {
  //         //   navigate("/user/dashboard");
  //         // }
  //         navigate("/admin/dashboard");
  //         window.location.reload();
  //       // }
  //     } catch (error) {
  //       if (error.response && error.response.data.message) {
  //         setError(error.response.data.message);
  //       } else {
  //         setError("Something went wrong. Please try again.");
  //       }
  //     }
  //   };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        companyCode: `EMS-${companyCode}`,
        email,
        password
      });

      console.log("LOGIN RESPONSE:", response.data);

      const data = response.data;

      // Save user
      localStorage.setItem("user", JSON.stringify(data));

      // Save token
      localStorage.setItem("token", data.token);

      updateUser(data);

      navigate("/admin/dashboard");

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
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please Check Your Mail For Login Details
        </p>

        <form action="" onSubmit={handleLogin}>
          <div className="flex items-center border rounded-md px-2 py-2 mb-3">

            <span className="text-gray-500 font-medium mr-1">
              EMS-
            </span>

            <input
              type="text"
              maxLength="6"
              value={companyCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setCompanyCode(value);
              }}
              placeholder="******"
              className="outline-none flex-1"
            />

          </div>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button className='btn-primary' type='submit' >
            LOGIN
          </button>

          {/* <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{""}
            <Link className='font-medium text-primary underline' to="/signup">
              SignUp
            </Link>
          </p> */}
          <p className="text-[13px] text-slate-800 mt-3">
            <Link className='font-medium text-primary underline' to="/forgotpassword">
              Forgot Password
            </Link>
          </p>
          <p className="text-[13px] text-slate-800 mt-3">
            Are you a Super Admin?{" "}
            <Link
              className="font-medium text-primary underline"
              to="/superadmin/login"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login