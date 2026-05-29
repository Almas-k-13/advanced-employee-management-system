import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashBoardLayout from "../../components/layouts/DashBoardLayout";

const ManageAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
  });

  const getSuperAdmin = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SUPERADMIN.GET_SUPERADMIN
      );

      const userData = response.data.user;
      setAdmin(userData);

      setForm({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        status: userData?.status || "Active",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSuperAdmin();
  }, []);

const handleUpdate = async (e) => {

  e.preventDefault();

  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("phone", form.phone);
  formData.append("status", form.status);

  if (image) {
    formData.append("profileImage", image);
  }

  try {

    await axiosInstance.put(
      API_PATHS.SUPERADMIN.UPDATE_SUPERADMIN(admin._id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
        toast.success("Admin Update successfully");
    setOpen(false);
    getSuperAdmin();

  } catch (error) {
    console.log(error);
  }

};

  return (
    <DashBoardLayout activeMenu="Super Admin">
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-6">Super Admin Profile</h2>

        {admin && (
          <>
            {/* Profile Card */}
            <div
              onClick={() => setOpen(true)}
              className="bg-white p-6 rounded-2xl shadow-md w-[360px] cursor-pointer hover:shadow-xl transition border border-gray-100"
            >
              <div className="flex flex-col items-center">
                <img
                  src={admin.profileImageUrl || "/default-avatar.png"}
                  alt="profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />

                <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                  {admin.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">{admin.email}</p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-black">Phone:</span>{" "}
                  {admin.phone || "N/A"}
                </p>

                <p>
                  <span className="font-medium text-black">Role:</span> Super
                  Admin
                </p>

                <p>
                  <span className="font-medium text-black">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${admin.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {admin.status}
                  </span>
                </p>
              </div>

              <div className="mt-6 text-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Edit Modal */}
            {open && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
                  >
                    ×
                  </button>

                  <h3 className="text-xl font-semibold mb-5">
                    Edit Super Admin
                  </h3>

                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashBoardLayout>
  );
};

export default ManageAdmin;