import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashBoardLayout";

const List = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.role;
  const hasResigned = data.some(
  (item) => item.user_id?._id === user?._id
);

  // Get All Resignations
  // const getAllResignations = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       API_PATHS.RESIGNATION.GET_ALL
  //     );
  //     setData(response.data.resignations || []);
  //   } catch (error) {
  //     console.error("Error fetching resignations:", error);
  //   }
  // };
  const getAllResignations = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.RESIGNATION.GET_ALL
    );

    console.log("API RESPONSE:", response.data);

    setData(response.data.resignations || []);
  } catch (error) {
    console.error("Error fetching resignations:", error);
  }
};

  useEffect(() => {
    getAllResignations();
  }, []);

  // Update Status
  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.patch(
        API_PATHS.RESIGNATION.UPDATE_STATUS(id),
        { status }
      );

      setOpenMenu(null);
      getAllResignations(); // refresh list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <DashboardLayout activeMenu="Resignation">
      <div className="mt-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            My Resignation
          </h2>

          {!hasResigned && (
            <button
              onClick={() => navigate("/admin/list/resignationform")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              + Add
            </button>
          )}
        </div>

        {/* Table */}
        <div className="form-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200 rounded-lg">

              <thead className="bg-slate-100">
                <tr className="text-left text-sm text-slate-700">
                  <th className="p-3 border-b">Username</th>
                  <th className="p-3 border-b">Resignation At</th>
                  <th className="p-3 border-b">Last Working Date</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Reason</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-slate-50 text-sm"
                    >
                      <td className="p-3">{item.user_id?.name}</td>

                      <td className="p-3">
                        {new Date(item.resignationAt).toLocaleDateString()}
                      </td>

                      <td className="p-3">
                        {new Date(item.lastWorkingDate).toLocaleDateString()}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : item.status === "Rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3">{item.reason}</td>

                      {/* 3 Dot Action */}
                      <td className="p-3 text-center relative">

                        {role === "Admin" && (
                          <>
                            <button
                              onClick={() =>
                                setOpenMenu(openMenu === index ? null : index)
                              }
                              className="p-2 hover:bg-slate-200 rounded-full"
                            >
                              <MoreVertical size={18} />
                            </button>

                            {openMenu === index && (
                              <div className="absolute right-6 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(item._id, "Approved")
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() =>
                                    handleStatusUpdate(item._id, "Rejected")
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </>
                        )}

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No Resignation Found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default List;