import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashBoardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import UserCard from '../../components/Cards/UserCard';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const role = loggedUser?.role?.role;

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.USERS.GET_ALL_USERS
      );
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.status === "Active").length;
  const inactiveUsers = allUsers.filter(u => u.status === "Inactive").length;

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className='mt-5 mb-10'>

        {/* Header */}
        <div className='flex md:flex-row md:items-center justify-between'>
          <h2 className='text-xl font-medium'>
            Team Members
          </h2>

          {role === "Admin" && (
            <button
              onClick={() => navigate("/admin/create-user")}
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer'
            >
              + Add
            </button>
          )}
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
          <div className='bg-white shadow rounded-lg p-4'>
            <h4 className='text-sm text-slate-500'>Total Users</h4>
            <p className='text-xl font-semibold'>{totalUsers}</p>
          </div>

          <div className='bg-green-50 shadow rounded-lg p-4'>
            <h4 className='text-sm text-slate-500'>Active Users</h4>
            <p className='text-xl font-semibold text-green-600'>
              {activeUsers}
            </p>
          </div>

          <div className='bg-red-50 shadow rounded-lg p-4'>
            <h4 className='text-sm text-slate-500'>Inactive Users</h4>
            <p className='text-xl font-semibold text-red-600'>
              {inactiveUsers}
            </p>
          </div>
        </div>

        {/* User Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;