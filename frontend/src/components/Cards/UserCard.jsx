import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserCard = ({ userInfo }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const role = loggedUser?.role?.role;

    // DELETE USER
    const handleDelete = async () => {
        try {
            await axiosInstance.delete(
                API_PATHS.USERS.DELETE_USER(userInfo._id)
            );

            toast.success("User deleted successfully");
            window.location.reload();

        } catch (error) {
            toast.error("Delete failed");
        }
    };

    // INVITE USER
    const handleInvite = async () => {
        try {

            await axiosInstance.post(
                API_PATHS.USERS.INVITE_USER(userInfo._id)
            );

            toast.success("Invitation email sent");

            window.location.reload();

        } catch (error) {

            toast.error("Invite failed");

        }
    };

    return (

        <div className="user-card p-2 relative">

            {/* 3 DOT MENU */}
            {role === "Admin" && (
                <div className="absolute right-2 top-2">

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-gray-500 hover:text-black"
                    >
                        <HiDotsVertical size={18} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded-md shadow-md z-10">

                            <button
                                onClick={() => navigate(`/admin/edit-user/${userInfo._id}`)}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleInvite}
                                disabled={userInfo?.isInvited}
                                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100
          ${userInfo?.isInvited ? "text-gray-400 cursor-not-allowed" : ""}`}
                            >
                                {userInfo?.isInvited ? "Invited" : "Invite"}
                            </button>

                            <button
                                onClick={handleDelete}
                                className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                            >
                                Delete
                            </button>

                        </div>
                    )}

                </div>
            )}


            {/* USER INFO */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">

                    <img
                        src={userInfo?.profileImageUrl || "https://i.pravatar.cc/100"}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />

                    <div>
                        <p className="text-sm font-medium">{userInfo?.name}</p>
                        <p className="text-xs text-gray-500">{userInfo?.email}</p>
                    </div>

                </div>
            </div>


            {/* TASK STATS */}
            <div className="flex items-end gap-3 mt-5">

                <StatCard
                    label="Pending"
                    count={userInfo?.pendingTasks || 0}
                    status="Pending"
                />

                <StatCard
                    label="InProgress"
                    count={userInfo?.inProgressTasks || 0}
                    status="InProgress"
                />

                <StatCard
                    label="Completed"
                    count={userInfo?.completedTasks || 0}
                    status="Completed"
                />

            </div>

        </div>
    )
}

export default UserCard


const StatCard = ({ label, count, status }) => {

    const getStatusTagColor = () => {

        switch (status) {

            case "InProgress":
                return "text-cyan-500 bg-gray-50";

            case "Completed":
                return "text-indigo-500 bg-gray-50";

            default:
                return "text-violet-500 bg-gray-50";
        }

    };

    return (
        <div
            className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-1 rounded`}
        >
            <span className='text-[12px] font-semibold'>{count}</span>
            <br />
            {label}
        </div>
    );
};