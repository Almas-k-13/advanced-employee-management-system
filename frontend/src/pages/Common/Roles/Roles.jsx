import React, { useState, useEffect } from "react";
import DashBoardLayout from "../../../components/layouts/DashBoardLayout";
import { Box, Tabs, Tab } from "@mui/material";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";

const Roles = () => {

  const [value, setValue] = useState(0);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  const modules = {
    dashboard: {
      label: "Dashboard",
      actions: ["view", "add", "update", "delete"]
    },
    task: {
      label: "Task",
      actions: ["view", "add", "update", "delete"]
    },
    teamMembers: {
      label: "Team Members",
      actions: ["view", "add", "update", "delete"]
    },
    reports: {
      label: "Reports",
      actions: ["view", "add", "update", "delete"]
    },
    salary: {
      label: "Salary",
      actions: ["view", "add", "update", "delete"]
    },
    resignation: {
      label: "Resignation",
      actions: ["view", "add", "update", "delete"]
    }
  };

  // GET ALL ROLES
  const getAllRoles = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ROLES.GET_ALL
      );

      const fetchedRoles = response.data.roles;

      setRoles(fetchedRoles);

      if (fetchedRoles.length > 0) {
        setSelectedRoleId(fetchedRoles[0]._id);
        setPermissions(fetchedRoles[0].permissions || {});
      }

    } catch (error) {
      console.log("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  // TAB CHANGE
  const handleChange = async (event, newValue) => {
    setValue(newValue);

    const roleId = roles[newValue]._id;
    setSelectedRoleId(roleId);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.ROLES.GET_BY_ID}/${roleId}`
      );

      setPermissions(response.data.role.permissions || {});

    } catch (error) {
      console.log("Error loading role:", error);
    }
  };

  // CHECKBOX CHANGE
  const handleCheckboxChange = (moduleKey, action) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev?.[moduleKey]?.[action],
      },
    }));
  };

  // SAVE PERMISSIONS
  const handleSave = async () => {
    try {
      setLoading(true);

      await axiosInstance.put(
        `${API_PATHS.ROLES.UPDATE}/${selectedRoleId}`,
        { permissions }
      );
      toast.success("Permissions updated successfully");
      // alert("Permissions Updated Successfully");

    } catch (error) {
      console.log("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashBoardLayout activeMenu="Roles">

      <div className="mt-6">
        <div className="form-card p-6">

          <h2 className="text-xl font-medium mt-6 mb-6">
            Role Permission Management
          </h2>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange}>
              {roles.map((role) => (
                <Tab key={role._id} label={role.role} />
              ))}
            </Tabs>
          </Box>

          {/* Permission Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full border border-slate-200 rounded-lg">

              <thead className="bg-slate-100">
                <tr className="text-left text-sm text-slate-700">
                  <th className="p-3 border-b">Module</th>
                  <th className="p-3 border-b text-center">View</th>
                  <th className="p-3 border-b text-center">Add</th>
                  <th className="p-3 border-b text-center">Update</th>
                  <th className="p-3 border-b text-center">Delete</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(modules).map((moduleKey, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50 text-sm"
                  >
                    <td className="p-3 font-medium text-slate-700">
                      {modules[moduleKey].label}
                    </td>

                    {["view", "add", "update", "delete"].map((action) => (
                      <td key={action} className="p-3 text-center">
                        {modules[moduleKey].actions.includes(action) ? (
                          <input
                            type="checkbox"
                            checked={
                              permissions?.[moduleKey]?.[action] || false
                            }
                            onChange={() =>
                              handleCheckboxChange(moduleKey, action)
                            }
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md"
            >
              {loading ? "Saving..." : "Save Permissions"}
            </button>
          </div>

        </div>
      </div>

    </DashBoardLayout>
  );
};

export default Roles;