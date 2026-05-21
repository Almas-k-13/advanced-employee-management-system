// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";

// export const UserContext = createContext();

// const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true); // New state to track loading

//     useEffect(() => {
//         if (user) return;
//         const accessToken = localStorage.getItem("token");
//         if (!accessToken) {
//             setLoading(false);
//             return;
//         }

//         const fetchUser = async () => {
//             try {
//                 const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
//                 setUser(response.data);
//             } catch (error) {
//                 console.error("User not authenticated", error);
//                 clearUser();
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, []);

//     const updateUser = (userData) => {
//         setUser(userData);
//         localStorage.setItem("token", userData.token); //Save token
//         setLoading(false);
//     };

//     const clearUser = () => {
//         setUser(null);
//         localStorage.removeItem("token");
//     };

//     return (
//         <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// }
// export default UserProvider

import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {

  // Load user from localStorage when app starts
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const accessToken = localStorage.getItem("token");

    // Agar token nahi hai to loading stop
    if (!accessToken) {
      setLoading(false);
      return;
    }

    // Agar user already localStorage me hai to fetch mat karo
    // if (user) {
    //   setLoading(false);
    //   return;
    // }

    const fetchUser = async () => {
      try {

        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

        setUser(response.data);

        localStorage.setItem("user", JSON.stringify(response.data));

      } catch (error) {

        console.error("User not authenticated", error);
        clearUser();

      } finally {

        setLoading(false);

      }
    };

    fetchUser();

  }, [user]);

  // Login ke baad call hoga
  const updateUser = (userData) => {

    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);

    setLoading(false);

  };

  // Logout
  const clearUser = () => {

    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUser,
        clearUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;