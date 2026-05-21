import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import Dashboard from './pages/Admin/Dashboard'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';

import UserDashboard from './pages/User/UserDashboard';
import MyTask from './pages/User/MyTask';

import ViewTaskDetails from './pages/User/ViewTaskDetails';
import UserProvider, { UserContext } from './context/userContext';
import { Toaster } from 'react-hot-toast'
import Clock from './pages/Common/Clock-In-ClockOut/Clock'
import Report from './pages/Common/Reports/Report'
import CreateUser from './pages/Admin/CreateUser'
import ForgotPassword from './pages/Auth/ForgotPassword'
import OtpVerification from './pages/Auth/OtpVerification'
import ResetPassword from './pages/Auth/ResetPassword'
import Clockform from './pages/Common/Clock-In-ClockOut/Clockform'
// import Resignation from './pages/Common/Resignation/Resignationform'
import Roles from './pages/Common/Roles/Roles'
import Salary from './pages/Common/Salary/Salary'
import List from './pages/Common/Resignation/list'
import ResignationForm from './pages/Common/Resignation/Resignationform'
import S_ForgotPassword from './pages/SuperAdminAuth/S_ForgotPassword'
import S_OtpVerification from './pages/SuperAdminAuth/S_OtpVerification'
import S_ResetPassword from './pages/SuperAdminAuth/S_ResetPassword'
import S_Login from './pages/SuperAdminAuth/S_Login'
import UpdateProfile from './pages/Common/Userprofile/UserProfile'
import S_Dashboard from './pages/SuperAdmin/S_Dashboard'
import ManageAdmin from './pages/SuperAdmin/ManageAdmin'
import CreateAdmin from './pages/SuperAdmin/CreateAdmin'
import Company from './pages/SuperAdmin/Company'
import EditCompany from './pages/SuperAdmin/EditCompany'
import Home from './pages/Home'


const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/signUp" element={<SignUp />} /> */}
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/OtpVerification" element={<OtpVerification />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
            <Route path='/superadmin/forgotpassword'element={<S_ForgotPassword/>}/>
            <Route path="/superadmin/verify-otp" element={<S_OtpVerification />} />
             <Route path="/superadmin/reset-password" element={<S_ResetPassword />} />
              <Route path="/superadmin/login" element={<S_Login />} />
             <Route path="/superadmin/dashboard"element={<S_Dashboard/>} />
             <Route path="/superadmin/manageadmin"element={<ManageAdmin/>} />
             <Route path="/superadmin/company"element={<Company/>} />
             <Route path="/superadmin/edit-company/:id" element={<EditCompany />} />
             <Route path="/superadmin/create-admin"element={<CreateAdmin/>} />
            {/* Admin Rotes */}
            <Route element={<PrivateRoute allowedRoles={["Admin","HR","Manager","Employee"]} />}>
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
              <Route path='/admin/clock' element={<Clock />} />
              <Route path="/admin/clock/Clockform" element={<Clockform />} />
              <Route path="/admin/clock/Clockform/:id" element={<Clockform />} />
              <Route path='/admin/users' element={<ManageUsers />} />
              <Route path="/admin/create-user" element={<CreateUser />} />
              <Route path="/admin/edit-user/:id" element={<CreateUser />} />
              <Route path='/admin/reports' element={<Report />} />
              <Route path='/admin/salary' element={<Salary />} />
             <Route path='/admin/list/ResignationForm'element={<ResignationForm/>}/>
             <Route path='/admin/list'element={<List/>}/>
              <Route path='/admin/roles' element={<Roles />} />

               <Route path='/admin/UpdateProfile' element={<UpdateProfile/>} />
              
            </Route>



            {/* User Rotes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/tasks' element={<MyTask />} />
              <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
            </Route>

            {/* Defualt Route */}
            <Route path='/' element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {

  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Navigate to="/admin/dashboard" />;
};