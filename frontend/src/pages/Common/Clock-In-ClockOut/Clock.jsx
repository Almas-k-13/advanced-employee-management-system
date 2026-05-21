import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MoreVertical } from "lucide-react";
import Input from '../../../components/Inputs/Input';

import CalendarView from "./CalendarView";
import DashboardLayout from "../../../components/layouts/DashBoardLayout";




const Clock = () => {
  const usr = JSON.parse(localStorage.getItem("user"));
  const userRole = usr?.role?.role;

  const isAdmin = userRole === "Admin";
  const isEmployee = userRole === "Employee";

  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const [clockList, setClockList] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());


  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const events = clockList.map((item) => {

    const date = new Date(item.in_time * 1000);

    // same start and end to force stacking
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));

    return {
      title: item.task_name,
      start,
      end,
      allDay: true
    };

  });


  const [tasks, setTasks] = useState([]);

  const [selectedTask, setSelectedTask] = useState("");

  const [description, setDescription] = useState("");

  const [runningClock, setRunningClock] = useState(null);

  const getClockList = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.CLOCK.GET_ALL);

      if (response.data?.status) {
        const list = response.data.data;

        setClockList(list);
        const activeClock = list.find(
          (item) => item.out_time === 0 && item.user_id === user._id
        );

        if (activeClock) {
          setRunningClock(activeClock);
        } else {
          setRunningClock(null);
        }
      }

    } catch (error) {
      console.log("Clock List Error:", error);
    }
  };

  useEffect(() => {
    getClockList();
    getTasks();
  }, []);

  const { user } = useContext(UserContext);



  const handleEdit = (item) => {
    toast("Opening edit form...");
    navigate(`/admin/clock/Clockform/${item.id}`);
    setOpenMenu(null);
  };
  const handleDelete = async (item) => {

    if (!window.confirm("Delete this clock record?")) return;

    try {

      await axiosInstance.delete(API_PATHS.CLOCK.DELETE(item.id));

      toast.success("Clock record deleted successfully");

      getClockList();

    } catch (error) {
      console.log("Delete error", error);
    }

  };

  const getTasks = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);

      // console.log("TASK API RESPONSE:", res.data);

      if (res.data?.tasks) {
        setTasks(res.data.tasks);
      }

    } catch (error) {
      console.log("Task fetch error", error);
    }
  };

  const handleStartClock = async () => {

    try {
      const payload = {
        user_id: user._id,
        task_id: selectedTask,
        description: description,
        in_time: Math.floor(Date.now() / 1000)
      };

      await axiosInstance.post(API_PATHS.CLOCK.CREATE, payload);

      setDescription("");
      setSelectedTask("");

      getClockList();

    } catch (error) {
      console.log("Clock start error", error);
    }

  };

  const handleStopClock = async () => {

    try {

      const payload = {
        id: runningClock.id,
        out_time: Math.floor(Date.now() / 1000),
      };

      await axiosInstance.post(API_PATHS.CLOCK.CREATE, payload);

      getClockList();

    } catch (error) {
      console.log("Clock stop error", error);
    }

  };


  return (
    <DashboardLayout activeMenu="Attendance">
      <div className="min-h-screen bg-slate-100 p-6">
        {/* Header Right */}
        <div className="flex justify-end mb-6">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/clock/Clockform")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg transition"
            >
              + Add
            </button>
          )}
        </div>
        {/* Form Card */}
        {isEmployee && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Task</option>

                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.title}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                disabled={!selectedTask && !runningClock}
                onClick={runningClock ? handleStopClock : handleStartClock}
                className={`rounded-xl py-3 font-semibold shadow-md transition text-white
${runningClock ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {runningClock ? "Stop" : "Start"}
              </button>
            </div>
          </div>)}

        {/* Calendar + Table Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6 items-stretch">

          {/* LEFT — CALENDAR */}
          <div className="xl:col-span-5">
            <CalendarView
              calendarEvents={events}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

          </div>
          {/* RIGHT — TABLE */}
          <div className="xl:col-span-7">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-6 py-4">User</th>
                      <th className="text-left px-6 py-4">Task</th>
                      <th className="text-left px-6 py-4">In Time</th>
                      <th className="text-left px-6 py-4">Out Time</th>
                      <th className="text-center px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clockList
                      .filter((item) => {
                        const taskDate = new Date(item.in_time * 1000);
                        return taskDate.toDateString() === selectedDate.toDateString();
                      })
                      .map((item, index) => (
                        <tr
                          key={index}
                          className="border-t hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-4 font-medium">
                            {item.user_name || "Unknown"}
                          </td>

                          <td className="px-6 py-4">
                            {item.task_name || "Unknown"}
                          </td>
                          {/* <td className="px-6 py-4">
                          {item.in_time ? new Date(item.in_time * 1000).toLocaleString() : "-"}
                        </td>

                        <td className="px-6 py-4">
                          {item.out_time ? new Date(item.out_time * 1000).toLocaleString() : "-"}
                        </td> */}

                          <td>
                            {item.in_time
                              ? new Date(item.in_time * 1000).toLocaleTimeString()
                              : "-"}
                          </td>

                          <td>
                            {item.out_time
                              ? new Date(item.out_time * 1000).toLocaleTimeString()
                              : "-"}
                          </td>

                          <td className="px-6 py-4 text-center relative">
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() =>
                                    setOpenMenu(openMenu === index ? null : index)
                                  }
                                  className="p-2 rounded-lg hover:bg-slate-100"
                                >
                                  <MoreVertical size={18} />
                                </button>

                                {openMenu === index && (
                                  <div className="absolute right-10 mt-2 w-32 bg-white border rounded-xl shadow-lg z-50">
                                    <button
                                      onClick={() => handleEdit(item)}
                                      className="block w-full text-left px-4 py-2 hover:bg-slate-100 rounded-t-xl"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(item)}
                                      className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-xl"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </>)}
                          </td>

                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default Clock
