import React from "react";
import DashBoardLayout from "../../../components/layouts/DashBoardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { LuFileDown } from "react-icons/lu";

const Report = () => {

  // ============================
  // DOWNLOAD REPORT FUNCTION
  // ============================

  const downloadReport = async (url, fileName) => {

    try {

      const response = await axiosInstance.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);

      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.log("Download error:", error);
    }

  };

  return (

    <DashBoardLayout activeMenu="Reports">

      <div className="my-5">

        <h2 className="text-xl md:text-2xl font-medium mb-6">
          Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* TASK REPORT */}
          <div className="card p-6 flex flex-col justify-between">

            <div>

              <h4 className="text-lg font-medium">
                Task Report
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Download complete task details in Excel format.
              </p>

            </div>

            <button
              onClick={() =>
                downloadReport(
                  API_PATHS.REPORTS.EXPORT_TASKS,
                  "tasks_report.xlsx"
                )
              }
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >

              <LuFileDown className="text-lg" />
              Download

            </button>

          </div>

          {/* USER TASK REPORT */}
          <div className="card p-6 flex flex-col justify-between">

            <div>

              <h4 className="text-lg font-medium">
                User Task Report
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Download tasks assigned to users.
              </p>

            </div>

            <button
              onClick={() =>
                downloadReport(
                  API_PATHS.REPORTS.EXPORT_USERS,
                  "users_report.xlsx"
                )
              }
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >

              <LuFileDown className="text-lg" />
              Download

            </button>

          </div>

          {/* ATTENDANCE REPORT */}
          <div className="card p-6 flex flex-col justify-between">

            <div>

              <h4 className="text-lg font-medium">
                Attendance Report
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Download employee attendance details.
              </p>

            </div>

            <button
              onClick={() =>
                downloadReport(
                  API_PATHS.REPORTS.EXPORT_ATTENDANCE,
                  "attendance_report.xlsx"
                )
              }
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >

              <LuFileDown className="text-lg" />
              Download

            </button>

          </div>

        </div>

      </div>

    </DashBoardLayout>

  );

};

export default Report;