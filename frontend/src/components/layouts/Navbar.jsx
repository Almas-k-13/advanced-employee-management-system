import React, { useContext, useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"
import SideMenu from './SideMenu';
import { UserContext } from '../../context/userContext';

const Navbar = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-30 shadow-sm">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        <button
          className="block lg:hidden text-gray-700"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        <h2 className="text-lg font-semibold text-gray-800">
          Employee Management System
        </h2>
      </div>

      {/* RIGHT PROFILE SECTION */}
      <div className="flex items-center gap-4">

        {/* User Info */}
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || ""}
          </p>
          <p className="text-xs text-gray-500">
            {user?.email || ""}
          </p>
        </div>

        {/* Avatar */}
        <div className="relative">
          <img
            src={user?.profileImageUrl || null}
            alt="Profile"
            className="w-10 h-10 rounded-full bg-slate-300 object-cover border"
          />

          {user?.role === "admin" && (
            <span className="absolute -bottom-1 -right-1 text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded">
              Admin
            </span>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear();
            clearUser();

            const path = window.location.pathname;

            if (path.startsWith("/superadmin")) {
              window.location.href = "/superadmin/login";
            } else {
              window.location.href = "/login";
            }
          }}
          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      {/* MOBILE SIDEMENU */}
      {openSideMenu && (
        <div className="fixed top-[61px] left-0 bg-white shadow-lg lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
}

export default Navbar