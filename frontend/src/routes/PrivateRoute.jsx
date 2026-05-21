import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const PrivateRoute = ({ allowedRoles }) => {

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {

    const checkUser = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

        // update latest user
        localStorage.setItem("user", JSON.stringify(res.data));

        const userRole = res.data?.role?.role;

        if (!allowedRoles || allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }

      } catch (error) {
        setAuthorized(false);
      }

      setLoading(false);

    };

    checkUser();

  }, []);

  if (loading) return null;

  return authorized ? <Outlet /> : <Navigate to="/login" replace />;

};

export default PrivateRoute;