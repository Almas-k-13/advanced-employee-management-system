// import { useState, useRef } from "react";
// import AuthLayout from "../../components/layouts/AuthLayout";
// import { useNavigate, useLocation } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPaths";
// import { useEffect } from "react";

// const S_OtpVerification = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const location = useLocation();
//   const email = location.state?.email;

//   const inputs = useRef([]);

//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     inputs.current[0]?.focus();
//   }, []);

//   if (!email) {
//     setError("Email not found. Please try again.");
//     navigate("/superadmin/forgotpassword");
//   }

//   const getOtpValue = () => otp.join("");

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();

//     const otpValue = getOtpValue();

//     if (otpValue.length !== 4) {
//       setError("Please enter valid OTP");
//       return;
//     }

//     try {
//       const response = await axiosInstance.post(
//         API_PATHS.SUPERADMINAUTH.VERIFY_OTP,
//         {
//           email,
//           otp: otpValue,
//         }
//       );

//       alert(response.data.message);

//       // Reset Password Page
//       navigate("/superadmin/reset-password", {
//         state: { email }
//       });

//     } catch (error) {
//       if (error.response && error.response.data.message) {
//         setError(error.response.data.message);
//       } else {
//         setError("Something went wrong");
//       }
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       await axiosInstance.post(API_PATHS.SUPERADMIN.FORGOT_PASSWORD, { email });
//       alert("OTP resent successfully");
//     } catch {
//       setError("Failed to resend OTP");
//     }
//   };

//   const handleChange = (e, index) => {
//     const value = e.target.value.replace(/[^0-9]/g, "");
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 3) {
//       inputs.current[index + 1]?.focus();
//     }
//   };

//   const handleBackspace = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputs.current[index - 1]?.focus();
//     }
//   };

//   return (
//     <AuthLayout>
//       <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
//         <h3 className="text-xl font-semibold text-black">
//           OTP Verification
//         </h3>

//         <p className="text-xs text-slate-700 mt-[5px] mb-6">
//           Enter the 4-digit code sent to your email
//         </p>

//         <form onSubmit={handleVerifyOtp}>
//           <div className="flex gap-3 mb-4">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 maxLength="1"
//                 value={digit}
//                 ref={(el) => (inputs.current[index] = el)}
//                 onChange={(e) => handleChange(e, index)}
//                 onKeyDown={(e) => handleBackspace(e, index)}
//                 className="w-12 h-12 text-center border rounded-md focus:ring-1 focus:ring-primary"
//               />
//             ))}
//           </div>

//           {error && <p className="text-red-500 text-xs pb-2">{error}</p>}
//           <button className="btn-primary" type="submit">
//             Verify OTP
//           </button>

//           <p className="text-[13px] text-slate-800 mt-3">
//             Didn't receive?{" "}
//             <span
//               onClick={handleResendOtp}
//               className="cursor-pointer underline text-primary"
//             >
//               Resend OTP
//             </span>
//           </p>
//         </form>
//       </div>
//     </AuthLayout>
//   );
// };

// export default S_OtpVerification;

import { useState, useRef, useEffect } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const S_OtpVerification = () => {

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const inputs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  // Focus first input
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Redirect if email missing
  useEffect(() => {
    if (!email) {
      navigate("/superadmin/forgotpassword");
    }
  }, [email, navigate]);

  const getOtpValue = () => otp.join("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpValue = getOtpValue();

    if (otpValue.length !== 4) {
      setError("Please enter valid OTP");
      return;
    }

    try {

      const response = await axiosInstance.post(
        API_PATHS.SUPERADMINAUTH.VERIFY_OTP,
        {
          email,
          otp: otpValue
        }
      );

      alert(response.data.message);

      navigate("/superadmin/reset-password", {
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

  const handleResendOtp = async () => {
    try {

      await axiosInstance.post(
        API_PATHS.SUPERADMINAUTH.FORGOT_PASSWORD,
        { email }
      );

      alert("OTP resent successfully");

    } catch {
      setError("Failed to resend OTP");
    }
  };

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

  return (
    <AuthLayout>

      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">

        <h3 className="text-xl font-semibold text-black">
          OTP Verification
        </h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter the 4-digit code sent to your email
        </p>

        <form onSubmit={handleVerifyOtp}>

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
            <p className="text-red-500 text-xs pb-2">
              {error}
            </p>
          )}

          <button className="btn-primary" type="submit">
            Verify OTP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">

            Didn't receive?{" "}

            <span
              onClick={handleResendOtp}
              className="cursor-pointer underline text-primary"
            >
              Resend OTP
            </span>

          </p>

        </form>

      </div>

    </AuthLayout>
  );
};

export default S_OtpVerification;