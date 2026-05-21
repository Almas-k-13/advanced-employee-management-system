import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const Company = () => {

  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);

  // GET ALL COMPANIES
  const fetchCompanies = async () => {
    try {

      const res = await axiosInstance.get(
        API_PATHS.COMPANY.GET_ALL
      );

      setCompanies(res.data);

    } catch (error) {

      toast.error("Failed to fetch companies");

    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);




  // DELETE COMPANY

  const deleteCompany = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this company?"
  );

  if (!confirmDelete) return;

  try {

    await axiosInstance.delete(
      API_PATHS.COMPANY.DELETE(id)
    );

    toast.success("Company deleted");

    fetchCompanies();

  } catch (error) {

    console.log(error);
    toast.error("Delete failed");

  }
};



  return (
    <DashboardLayout activeMenu="Company">

      <div className="p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-semibold text-gray-800">
            Company Management
          </h2>

          <button
            onClick={() => navigate("/superadmin/create-admin")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Company
          </button>

        </div>


        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          <table className="w-full text-sm text-left">

            <thead className="bg-gray-50 text-gray-600">

              <tr>
                <th className="px-6 py-3">Company Name</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>

            </thead>


            <tbody>

              {companies.map((company) => (

                <tr key={company._id} className="border-t">

                  <td className="px-6 py-4 font-medium text-gray-700">
                    {company.name}
                  </td>

                  <td className="px-6 py-4">
                    {company.city}
                  </td>

                  <td className="px-6 py-4">

                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                      {company.plan}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      Active
                    </span>

                  </td>

                  <td className="px-6 py-4 flex gap-3">

                    <button
                      onClick={() => navigate(`/superadmin/edit-company/${company._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCompany(company._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Company;