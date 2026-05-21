import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const S_Dashboard = () => {

  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [companyEmployees, setCompanyEmployees] = useState([]);




 useEffect(() => {
  getDashboardData();
}, []);

const getDashboardData = async () => {
  try {

    const { data } = await axiosInstance.get(
      API_PATHS.SUPER_ADMIN_DASHBOARD.GET_DASHBOARD
    );

    setTotalCompanies(data.totalCompanies);
    setTotalAdmins(data.totalAdmins);
    setCompanyEmployees(data.companyEmployees);

  } catch (error) {
    console.log(error);
  }
};

// const handleDeleteCompany = async (id) => {

//   try {

//     await axiosInstance.delete(`/company/${id}`);

//     // dashboard refresh
//     getDashboardData();

//   } catch (error) {
//     console.log(error);
//   }

// };

const handleDeleteCompany = async (id) => {

  try {

    await axiosInstance.delete(`/company/${id}`);

    window.location.reload();

  } catch (error) {
    console.log(error);
  }

};

  return (
    <DashboardLayout activeMenu="Dashboard">

      <div className="flex-1 p-6">

        <h2 className="text-2xl font-bold mb-6">
          Super Admin Dashboard
        </h2>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <p className="text-gray-500">Total Companies</p>
      
            <h3 className="text-3xl font-bold text-blue-600">
              {totalCompanies}
            </h3>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <p className="text-gray-500">Total Admins</p>
            <h3 className="text-3xl font-bold text-green-600">
              {totalAdmins}
            </h3>
          </div>

        </div>

        {/* Company wise employees */}
        <div className="bg-white border rounded-lg p-6">

  <h3 className="text-lg font-semibold mb-4">
    Company Wise Employees
  </h3>

  <table className="w-full border">

    <thead className="bg-gray-100">
      <tr>
        <th className="p-3 text-left border">Company</th>
        <th className="p-3 text-left border">Total Employees</th>
      </tr>
    </thead>

    <tbody>

      {companyEmployees.length > 0 ? (
        companyEmployees.map((item, index) => (
          <tr key={index}>
            <td className="p-3 border">
              {item.companyName}
            </td>
            <td className="p-3 border">
              {item.totalEmployees}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="2" className="p-3 text-center">
            No Data Found
          </td>
        </tr>
      )}

    </tbody>

  </table>

</div>

      </div>

    </DashboardLayout>
  );
};

export default S_Dashboard;