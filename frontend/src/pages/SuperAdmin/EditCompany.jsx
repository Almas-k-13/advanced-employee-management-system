import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashBoardLayout from "../../components/layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const EditCompany = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
    phoneNumber: "",
    address: "",
    plan: ""
  });


  // GET COMPANY DATA
  const fetchCompany = async () => {
    try {

      const res = await axiosInstance.get(
        API_PATHS.COMPANY.GET_BY_ID(id)
      );

      setFormData(res.data);

    } catch (error) {

      toast.error("Failed to load company");

    }
  };


  useEffect(() => {
    fetchCompany();
  }, []);




  // HANDLE INPUT
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };



  // UPDATE COMPANY
  const handleSubmit = async () => {
    try {

      await axiosInstance.put(
        API_PATHS.COMPANY.UPDATE(id),
        formData
      );

      toast.success("Company updated successfully");

      navigate("/superadmin/company");

    } catch (error) {

      toast.error("Update failed");

    }
  };



  return (
    <DashBoardLayout activeMenu="Company">

      <div className="p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Edit Company
        </h2>


        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm text-gray-600">
                Company Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg p-2"
              />
            </div>


            <div>
              <label className="text-sm text-gray-600">
                City
              </label>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg p-2"
              />
            </div>


            <div>
              <label className="text-sm text-gray-600">
                Email
              </label>

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg p-2"
              />
            </div>


            <div>
              <label className="text-sm text-gray-600">
                Phone Number
              </label>

              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg p-2"
              />
            </div>


            <div>
              <label className="text-sm text-gray-600">
                Plan
              </label>

              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg p-2"
              >
                <option>Basic</option>
                <option>Pro</option>
                <option>Enterprise</option>
              </select>
            </div>


            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg p-2"
              />
            </div>

          </div>



          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Update Company
          </button>

        </div>

      </div>

    </DashBoardLayout>
  );
};

export default EditCompany;