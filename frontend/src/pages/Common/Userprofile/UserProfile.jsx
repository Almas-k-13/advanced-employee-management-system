import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import DashBoardLayout from "../../../components/layouts/DashBoardLayout";

const UpdateProfile = () => {

  // safe localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [department, setDepartment] = useState(user?.department || "");

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImageUrl || "");

  // image preview
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // submit update
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("department", department);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await axiosInstance.put(
        `/api/users/update/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Profile Updated Successfully");

      // update localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));

    } catch (error) {

      console.log(error);
      toast.error("Update Failed");

    }
  };

  return (
    <DashBoardLayout activeMenu="UpdateProfile">

      <div className="flex justify-center mt-10">

        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">

          <h2 className="text-2xl font-semibold text-center mb-6">
            Update Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Profile Image */}

            <div className="flex flex-col items-center">

              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">

                {preview ? (

                  <img
                    src={preview}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>

                )}

              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-3 text-sm"
              />

            </div>

            {/* Name */}

            <div>
              <label className="text-sm font-medium">Name</label>

              <input
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}

            <div>
              <label className="text-sm font-medium">Email</label>

              <input
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Department */}

            <div>
              <label className="text-sm font-medium">Department</label>

              <input
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            {/* Phone */}

            <div>
              <label className="text-sm font-medium">Phone</label>

              <input
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Button */}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </button>

          </form>

        </div>

      </div>

    </DashBoardLayout>
  );
};

export default UpdateProfile;