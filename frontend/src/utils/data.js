import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuFileText,
    LuClock,
    LuWallet,
    LuLogOut,
    LuShield,
    LuUserMinus
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard",
        module: "dashboard"
    },

    {
        id: "02",
        label: "Tasks",
        icon: LuClipboardCheck,
        path: "/admin/tasks",
        module: "task"
    },

    {
        id: "03",
        label: "Attendance",
        icon: LuClock,
        path: "/admin/clock",
        module: "attendance"
    },

    {
        id: "04",
        label: "Team Members",
        icon: LuUsers,
        path: "/admin/users",
        module: "teamMembers"
    },

    {
        id: "05",
        label: "Reports",
        icon: LuFileText,
        path: "/admin/reports",
        module: "reports"
    },

    {
        id: "06",
        label: "Salary",
        icon: LuWallet,
        path: "/admin/salary",
        module:"salary"
    },

    {
        id: "07",
        label: "Roles",
        icon: LuShield,
        path: "/admin/roles",
        module: "roles"
    },

    {
        id: "08",
        label: "Resignation",
        icon: LuUserMinus , 
        path: "/admin/list",
       module: "resignation"
    },

      {
        id: "09",
        label: "UpdateProfile",
        icon: LuUserMinus , 
        path: "/admin/updateprofile",
       module: "updateprofile"
    },

];
// export const SIDE_MENU_ADMIN_DATA = [
//     {
//         id: "01",
//         label: "Dashboard",
//         icon: LuLayoutDashboard,
//         path: "/suoeradmin/dashboard",
//     },
//     {
//         id: "02",
//         label: "Superadmin",
//         icon: LuClipboardCheck,
//         path: "/user/tasks",
//     },
//      {
//         id: "03",
//         label: "Company",
//         icon: LuClipboardCheck,
//         path: "/user/tasks",
//     },
//     {
//         id: "05",
//         label: "Logout",
//         icon: LuLogOut,
//         path: "logout",
//     },
// ];
import { HiOutlineViewGrid } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";


export const SUPER_ADMIN_MENU = [
  {
    id: "01",
    label: "Dashboard",
    path: "/superadmin/dashboard",
    icon: HiOutlineViewGrid,
  },
  {
    id: "02",
    label: "Super Admin",
    path: "/superadmin/manageadmin",
    icon: HiOutlineUserGroup,
  },
  {
    id: "03",
    label: "Company",
    path: "/superadmin/company",
    icon: HiOutlineOfficeBuilding,
  },
 
];

// export const SIDE_MENU_USER_DATA = [
//     {
//         id: "01",
//         label: "Dashboard",
//         icon: LuLayoutDashboard,
//         path: "/user/dashboard",
//     },
//     {
//         id: "02",
//         label: "My Tasks",
//         icon: LuClipboardCheck,
//         path: "/user/tasks",
//     },
//     {
//         id: "05",
//         label: "Logout",
//         icon: LuLogOut,
//         path: "logout",
//     },
// ];

export const PRIORITY_DATA = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
]

export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" }
]