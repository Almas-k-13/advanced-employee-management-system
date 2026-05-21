// export const BASE_URL = "http://localhost:8000";
// // utils/apiPaths.js
// export const API_PATHS = {
//     AUTH: {
//         REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
//         LOGIN: "/api/auth/login", // Authenticate user & return JWT token
//         GET_PROFILE: "/api/auth/profile", // Get logged-in user details
//         FORGOT_PASSWORD: "/api/auth/forgot-password",
//         VERIFY_OTP: "/api/auth/verify-otp",
//         RESET_PASSWORD: "/api/auth/reset-password"
//     },
//     ROLES: {
//         GET_ALL: "/api/roles/get-all",
//         GET_BY_ID: "/api/roles/get",
//         UPDATE: "/api/roles/update"
//     },

// import { getAllRoles } from "../../../backend/controllers/rolesController";
// import resignation from "../../../backend/models/resignation";

//     USERS: {
//         GET_ALL_USERS: "/api/users", // Get all users (Admin only)
//         GET_USER_BY_ID: (userId) => `/api/users / ${userId}`, // Get user by ID
//         CREATE_USER: "/api/users/create", // Create a new user (Admin only)
//         UPDATE_USER: (userId) => ` /api/users/${userId}`, // Update user details
//         DELETE_USER: (userId) => `/api/users/${userId}` // Delete a user
//     },

//     TASKS: {
//         GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
//         GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashb
//         GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assign
//         GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
//         CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
//         UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
//         DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin on
//         UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update tas
//         UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update to
//     },

//     REPORTS: {
//         EXPORT_TASKS: "/api/reports/export/tasks", // Download all tasks as an Excel
//         EXPORT_USERS: "/api/reports/export/users", // Download user-task report
//     },
//     IMAGE: {
//         UPLOAD_IMAGE: "api/auth/upload-image",
//     },
// };


export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    FORGOT_PASSWORD: "/api/auth/forgotpassword",
    VERIFY_OTP: "/api/auth/verify-otp",
    RESET_PASSWORD: "/api/auth/reset-password",
    GET_ME: "/api/auth/me"
  },

  SUPERADMINAUTH: {
    REGISTER: "/api/superauthadmin/registersuperadmin",
    LOGIN: "/api/superauthadmin/loginsuperadmin",
    FORGOT_PASSWORD: "/api/superauthadmin/forgot-password",
    VERIFY_OTP: "/api/superauthadmin/verify-otp",
    RESET_PASSWORD: "/api/superauthadmin/reset-password",
  },

  SUPERADMIN: {

    GET_SUPERADMIN: "/api/superadmin/profile",

    UPDATE_SUPERADMIN: (id) => `/api/superadmin/${id}`

  },

  ROLES: {
    GET_ALL: "/api/roles/get-all",
    GET_BY_ID: "/api/roles/get",
    UPDATE: "/api/roles/update"
  },

  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (id) => `/api/users/${id}`,
    CREATE_USER: "/api/users/create",
    UPDATE_USER: (id) => `/api/users/update/${id}`,
    DELETE_USER: (id) => `/api/users/delete/${id}`,
    INVITE_USER: (id) => `/api/users/invite/${id}`,
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashb
    GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assign
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
    CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin on
    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update tas
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update to
  },
  DASHBOARD: {
    GET_ATTENDANCE_STATS: "/api/dashboard/attendance-stats"
  },

  CLOCK: {
    GET_ALL: "/api/clock",
    GET_BY_ID: (id) => `/api/clock/${id}`,
    CREATE: "/api/clock",
    DELETE: (id) => `/api/clock/${id}`,
    UPDATE: (id) => `api/clock/${id}`
  },

  COMPANY: {
    CREATE: "/api/company",
    GET_ALL: "/api/company",
    GET_BY_ID: (id) => `/api/company/${id}`,
    UPDATE: (id) => `/api/company/${id}`,
    DELETE: (id) => `/api/company/${id}`,
  },



  RESIGNATION: {
    GET_ALL: "/api/resignation/get-all",
    CREATE: "/api/resignation/create",
    UPDATE_STATUS: (id) => `/api/resignation/update-status/${id}`,
  },

  SUPER_ADMIN_DASHBOARD: {
    GET_DASHBOARD: "/api/superadmindashboard/dashboard"
  },


  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users",
    EXPORT_ATTENDANCE: "/api/reports/export/attendance"
  },


  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};