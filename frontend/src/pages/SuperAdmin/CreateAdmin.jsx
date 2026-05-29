import React, { useState } from "react";
import DashBoardLayout from "../../components/layouts/DashBoardLayout";
import { toast } from 'react-hot-toast';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {

  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("Pro");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phoneNumber: "",
    email: "",
    address: "",
    contactPersonName: "",
    contactPersonPhone: "",
    plan: "Pro",
    user: {
      name: "",
      email: "",
      password: ""
    }
  });
  const PLAN_PRICES = {
    Basic: 499,
    Pro: 999,
    Enterprise: 1999
  };

  const validateStep1 = () => {

    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return false;
    }

    if (!formData.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Company email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {

    if (!formData.contactPersonName.trim()) {
      toast.error("Contact person name required");
      return false;
    }

    if (!formData.contactPersonPhone.trim()) {
      toast.error("Contact person phone required");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.contactPersonPhone)) {
      toast.error("Contact phone must be 10 digits");
      return false;
    }

    return true;
  };

  const validateStep3 = () => {

    if (!formData.user.name.trim()) {
      toast.error("Admin name required");
      return false;
    }

    if (!formData.user.email.trim()) {
      toast.error("Admin email required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.user.email)) {
      toast.error("Invalid admin email");
      return false;
    }

    if (!formData.user.password) {
      toast.error("Admin password required");
      return false;
    }

    if (formData.user.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const nextStep = () => {

    if (step === 1 && !validateStep1()) return;

    if (step === 2 && !validateStep2()) return;

    setStep(step + 1);

  };
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      user: {
        ...formData.user,
        [name]: value
      }
    });
  };

  const handlePayment = async () => {
    console.log(import.meta.env.VITE_RAZORPAY_KEY);
    try {
      const amount = PLAN_PRICES[plan];
      const orderRes = await axiosInstance.post(
        "/api/payment/create-order",
        {
          amount
        }
      );


      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "EMS SaaS",
        description: plan + " Plan",
        order_id: orderRes.data.id,

        handler: async function (response) {
          try {

            const payload = {
              ...formData,
              amount,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id
            };

            const res = await axiosInstance.post(
              API_PATHS.COMPANY.CREATE,
              payload
            );

            console.log("Company Create Response:", res);

            if (res.status === 200 || res.status === 201) {

              toast.success(
                "🎉 Payment Successful & Company Created Successfully!"
              );

              setTimeout(() => {
                navigate("/superadmin/company");
              }, 2000);

            }

          } catch (error) {

            console.log("Create Company Error:", error);

            toast.error(
              error?.response?.data?.message ||
              "Company creation failed"
            );

          }
        }
      };

      const razor = new window.Razorpay(options);

      razor.open();

    } catch (err) {

      console.log(err);

      toast.error("Payment Failed");
    }
  };

  const handleSubmit = async () => {

    if (!validateStep3()) return;
    try {

      const res = await axiosInstance.post(
        API_PATHS.COMPANY.CREATE,
        formData
      );

      toast.success("Company Created Successfully");

      console.log(res.data);
      // redirect
      navigate("/superadmin/company");


    } catch (error) {

      console.log(error);
      toast.error("Error creating company");

    }
  };

  return (
    <DashBoardLayout activeMenu="Company">

      <div className="mt-6">

        {/* PAGE HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Company & Admin
          </h2>
        </div>


        {/* STEPPER */}
        <div className="flex items-center mb-8">

          {["Company", "Contact", "Admin"].map((label, index) => {

            const stepNumber = index + 1;

            return (
              <div key={label} className="flex items-center">

                <div className={`w-9 h-9 flex items-center justify-center rounded-full font-medium
                ${step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {stepNumber}
                </div>

                <span className="ml-2 mr-6 text-sm font-medium text-gray-600">
                  {label}
                </span>

              </div>
            );
          })}

        </div>



        {/* FORM CARD */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">


          {/* STEP 1 */}
          {step === 1 && (

            <div>

              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Company Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="text-sm text-gray-600">Company Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({
                        ...formData,
                        phoneNumber: value
                      });
                    }}
                    maxLength="10"
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

              </div>

            </div>
          )}



          {/* STEP 2 */}
          {step === 2 && (

            <div>

              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Contact Person
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="text-sm text-gray-600">Contact Person Name</label>
                  <input
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Contact Person Phone</label>
                  <input
                    name="contactPersonPhone"
                    value={formData.contactPersonPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({
                        ...formData,
                        contactPersonPhone: value
                      });
                    }}
                    maxLength="10"
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

              </div>

            </div>
          )}



          {/* STEP 3 */}
          {step === 3 && (

            <div>

              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Admin Account
              </h3>

              <div className="grid md:grid-cols-3 gap-5 mb-8">

                <div>
                  <label className="text-sm text-gray-600">Admin Name</label>
                  <input
                    name="name"
                    value={formData.user.name}
                    onChange={handleUserChange}
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Admin Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.user.email}
                    onChange={handleUserChange}
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Admin Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.user.password}
                    onChange={handleUserChange}
                    className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

              </div>


              {/* PLAN SELECTOR */}
              <h3 className="text-lg font-semibold mb-6 text-gray-800">
                Select Plan
              </h3>

              <div className="grid md:grid-cols-3 gap-6">

                {/* BASIC PLAN */}
                <div
                  onClick={() => {
                    setPlan("Basic");
                    setFormData({ ...formData, plan: "Basic" });
                  }}
                  className={`cursor-pointer rounded-2xl border p-6 transition shadow-sm
    ${plan === "Basic"
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "hover:border-blue-400 hover:shadow"
                    }`}
                >

                  <h4 className="text-xl font-semibold mb-1">Basic</h4>

                  {/* PRICE */}
                  <p className="text-3xl font-bold text-gray-800 mb-4">
                    ₹499
                    <span className="text-sm font-normal text-gray-500"> /month</span>
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    For small teams getting started
                  </p>

                  <ul className="space-y-2 text-sm text-gray-600">

                    <li><span className="text-green-500 font-bold mr-2">✔</span> Dashboard</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Tasks</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Team Members</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Update Profile</li>

                  </ul>

                </div>



                {/* PRO PLAN */}
                <div
                  onClick={() => {
                    setPlan("Pro");
                    setFormData({ ...formData, plan: "Pro" });
                  }}
                  className={`cursor-pointer rounded-2xl border p-6 transition shadow-sm relative
    ${plan === "Pro"
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "hover:border-blue-400 hover:shadow"
                    }`}
                >

                  <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>

                  <h4 className="text-xl font-semibold mb-1">Pro</h4>

                  {/* PRICE */}
                  <p className="text-3xl font-bold text-gray-800 mb-4">
                    ₹999
                    <span className="text-sm font-normal text-gray-500"> /month</span>
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    Best for growing companies
                  </p>

                  <ul className="space-y-2 text-sm text-gray-600">

                    <li><span className="text-green-500 font-bold mr-2">✔</span> Dashboard</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Tasks</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Attendance</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Team Members</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Reports</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Roles</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Update Profile</li>

                  </ul>

                </div>



                {/* ENTERPRISE PLAN */}
                <div
                  onClick={() => {
                    setPlan("Enterprise");
                    setFormData({ ...formData, plan: "Enterprise" });
                  }}
                  className={`cursor-pointer rounded-2xl border p-6 transition shadow-sm
    ${plan === "Enterprise"
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "hover:border-blue-400 hover:shadow"
                    }`}
                >

                  <h4 className="text-xl font-semibold mb-1">Enterprise</h4>

                  {/* PRICE */}
                  <p className="text-3xl font-bold text-gray-800 mb-4">
                    ₹1999
                    <span className="text-sm font-normal text-gray-500"> /month</span>
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    Full access to all features
                  </p>

                  <ul className="space-y-2 text-sm text-gray-600">

                    <li><span className="text-green-500 font-bold mr-2">✔</span> Dashboard</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Tasks</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Attendance</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Team Members</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Reports</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Roles</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Salary</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Resignation</li>
                    <li><span className="text-green-500 font-bold mr-2">✔</span> Update Profile</li>

                  </ul>

                </div>

              </div>
            </div>
          )}



          {/* BUTTONS */}
          <div className="flex justify-between mt-10">

            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-5 py-2 border rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handlePayment}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Company
              </button>
            )}

          </div>


        </div>

      </div>

    </DashBoardLayout>
  );
};

export default CreateAdmin;



