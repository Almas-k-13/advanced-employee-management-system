import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashBoardLayout";

const ResignationForm = () => {
  const navigate = useNavigate();

  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      toast.error("User not logged in");
      return;
    }

    try {

      const payload = {
        lastWorkingDate,
        reason
      };

      console.log("Payload:", payload);

      await axiosInstance.post(
        API_PATHS.RESIGNATION.CREATE,
        payload
      );

      toast.success("Resignation Submitted Successfully");
      navigate("/admin/list");

    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");

    }
  };
  return (
    <DashboardLayout activeMenu="Resignation">
      <div className="mt-6 flex justify-center">
        <div className="form-card w-full max-w-lg p-6">

          <h2 className="text-xl font-semibold mb-6">
            Submit Resignation
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Working Date
              </label>
              <input
                type="date"
                value={lastWorkingDate}
                onChange={(e) => setLastWorkingDate(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reason
              </label>
              <textarea
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason..."
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/list")}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResignationForm;