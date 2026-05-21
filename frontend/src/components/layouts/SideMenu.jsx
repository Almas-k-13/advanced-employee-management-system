import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA, SUPER_ADMIN_MENU } from '../../utils/data';
import { PLAN_FEATURES } from "../../utils/planFeatures";

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    if (!user) return null;
    const [sideMenuData, setSideMenuData] = useState([]);
    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === "logout") {
            handelLogout();
            return;
        }

        navigate(route);
    };

    const handelLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    // useEffect(() => {
    //     if (user) {
    //         // setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
    //         setSideMenuData(SIDE_MENU_DATA)
    //     }
    //     return () => { };
    // }, [user]);
    // useEffect(() => {

    //     if (!user) return;

    //     // SUPER ADMIN CHECK
    //     if (user?.email === "superadmin@gmail.com") {
    //         setSideMenuData(SUPER_ADMIN_MENU);
    //         return;
    //     }

    //     const userRole = user?.role?.role;
    //     const permissions = user?.role?.permissions;

    //     // Admin → sab menu
    //     if (userRole === "Admin") {
    //         setSideMenuData(SIDE_MENU_DATA);
    //         return;
    //     }

    //     // Employee → permission check
    //     const filteredMenu = SIDE_MENU_DATA.filter(menu =>
    //         permissions?.[menu.module]?.view
    //     );

    //     setSideMenuData(filteredMenu);

    // }, [user]);
    useEffect(() => {

        if (!user) return;

        // if (user?.email === "superadmin@gmail.com") {
        //     setSideMenuData(SUPER_ADMIN_MENU);
        //     return;
        // }
        if (user?.email === "kureshialmas805@gmail.com") {
            setSideMenuData(SUPER_ADMIN_MENU);
            return;
        }

        const userRole = user?.role?.role;
        const permissions = user?.role?.permissions;
        const companyPlan = user?.plan;

        const allowedModules = PLAN_FEATURES[companyPlan] || [];

        if (userRole === "Admin") {

            const companyPlan = user?.plan;
            const allowedModules = PLAN_FEATURES[companyPlan] || [];

            const filteredMenu = SIDE_MENU_DATA.filter(menu =>
                allowedModules.includes(menu.module)
            );

            setSideMenuData(filteredMenu);
            return;
        }
//         console.log("USER DATA:", user);
//         console.log("PLAN:", user?.plan)
// console.log("ALLOWED:", PLAN_FEATURES[user?.plan])

        const filteredMenu = SIDE_MENU_DATA.filter(menu => {

            const roleAllowed = permissions?.[menu.module]?.view;
            const planAllowed = allowedModules.includes(menu.module);

            return roleAllowed && planAllowed;

        });

        setSideMenuData(filteredMenu);

    }, [user]);
    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200 sticky top-[61px] z-20'>
            {/* <div className='flex flex-col items-center justify-center mb-7 pt-5'>
                <div className='relative'>
                    <img
                        src={user?.profileImageUrl || ""}
                        alt='Profile Image'
                        className='w-20 h-20 bg-slate-400 rounded-full'
                    />

                </div>

                {user?.role === "admin" && (
                    <div className='text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1'>
                        Admin
                    </div>
                )}

                <h5 className='text-gray-950 font-medium leading-6 mt-3'>
                    {user?.name || ""}
                </h5>

                <p className='text-[12px] text-gray-500'>{user?.email || ""}</p>
            </div> */}

            {sideMenuData.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${activeMenu == item.label
                        ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                        : ""
                        } py-3 px-6 mb-3 cursor-pointer`}
                    onClick={() => handleClick(item.path)}
                >
                    <item.icon className="text-xl" />
                    {item.label}
                </button>

            ))}
        </div >
    )
}

export default SideMenu