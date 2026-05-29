import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashBoardLayout from "../../components/layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";



const CreateUser = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "HR",
    email: "",
    phone: "",
    salary: "",
    role: "",
    status: "Active"
  });
  const [errors, setErrors] = useState({});

  // Fetch Roles from Backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.ROLES.GET_ALL
        );
        setRoles(res.data.roles);

        if (res.data.roles.length > 0) {
          setFormData(prev => ({
            ...prev,
            role: res.data.roles[0]._id
          }));
        }

      } catch (error) {
        console.log("Error loading roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {

    if (!isEditMode) return;

    const getUser = async () => {
      try {

        const res = await axiosInstance.get(
          API_PATHS.USERS.GET_USER_BY_ID(id)
        );

        const user = res.data;

        setFormData({
          name: user.name || "",
          department: user.department || "HR",
          email: user.email || "",
          phone: user.phone || "",
          salary: user.salary || "",
          role: user.role || "",
          status: user.status || "Active"
        });

      } catch (error) {
        console.log("Error loading user:", error);
      }
    };

    getUser();

  }, [id]);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.salary || formData.salary <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create User API
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      if (isEditMode) {

        await axiosInstance.put(
          API_PATHS.USERS.UPDATE_USER(id),
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        toast.success("User updated successfully");

      } else {

        await axiosInstance.post(
          API_PATHS.USERS.CREATE_USER,
          data
        );

        toast.success("User created successfully");
      }

      navigate("/admin/users");

    } catch (error) {

      console.log("Error:", error);

    } finally {

      setLoading(false);

    }

  };

  return (
    <DashBoardLayout activeMenu="Team Members">

      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>

            <h2 className='text-xl font-medium'>
              {isEditMode ? "Edit Employee" : "Create Employee"}
            </h2>

            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className='mt-4'>
                <label className='text-xs font-medium text-slate-600'>
                  Full Name <span className='text-red-500'>*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className='form-input'
                  placeholder='Enter full name'
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Department */}
              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Department <span className='text-red-500'>*</span>
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className='form-input'
                >
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="IT">IT</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              {/* Salary */}
              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Salary <span className='text-red-500'>*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className='form-input'
                  placeholder='Enter salary'
                  required
                />
                {errors.salary && (
                  <p className="text-red-500 text-xs mt-1">{errors.salary}</p>
                )}
              </div>

              {/* Email */}
              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Email Address <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className='form-input'
                  placeholder='john@example.com'
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Phone (Optional)
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className='form-input'
                  placeholder='9876543210'
                />
              </div>

              {/* Profile Image */}
              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Profile Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="form-input"
                />
              </div>

              {/* Role + Status */}
              <div className='grid grid-cols-12 gap-4 mt-3'>

                <div className='col-span-6'>
                  <label className='text-xs font-medium text-slate-600'>
                    Role <span className='text-red-500'>*</span>
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className='form-input'
                  >
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>

                <div className='col-span-6'>
                  <label className='text-xs font-medium text-slate-600'>
                    Status <span className='text-red-500'>*</span>
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className='form-input'
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-8 flex gap-4">

                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="flex-1 py-3 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition duration-200 shadow-sm cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md cursor-pointer"
                >
                  {loading
                    ? (isEditMode ? "Updating..." : "Creating...")
                    : (isEditMode ? "UPDATE EMPLOYEE" : "CREATE EMPLOYEE")}
                </button>

              </div>

            </form>

          </div>
        </div>
      </div>

    </DashBoardLayout>
  );
};

export default CreateUser;