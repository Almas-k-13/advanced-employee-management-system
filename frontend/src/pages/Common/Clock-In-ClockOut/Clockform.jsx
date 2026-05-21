import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/layouts/DashBoardLayout";


const Clockform = () => {
    const { id } = useParams();   // ✅ pehle id
    const navigate = useNavigate();
    const isEditMode = Boolean(id); // ✅ baad me use

    console.log("Clock ID:", id);

    const [formData, setFormData] = useState({
        user_id: "",
        task_id: "",
        description: "",
        in_time: "",
        out_time: ""
    });

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);


    const getUsers = async () => {
        try {

            const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

            console.log("USERS API RESPONSE:", res.data);

            // API directly array return kar rahi hai
            if (Array.isArray(res.data)) {
                setUsers(res.data);
            }

        } catch (error) {
            console.log("User fetch error", error);
        }
    };

    const getTasks = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);

            if (res.data?.tasks) {
                setTasks(res.data.tasks);
            }
        } catch (error) {
            console.log("Task fetch error", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {

        try {

            const payload = {
                user_id: formData.user_id,
                task_id: formData.task_id,
                description: formData.description,
                in_time: formData.in_time
                    ? Math.floor(new Date(formData.in_time).getTime() / 1000)
                    : 0,
                out_time: formData.out_time
                    ? Math.floor(new Date(formData.out_time).getTime() / 1000)
                    : 0
            };

            if (isEditMode) {
                await axiosInstance.post(API_PATHS.CLOCK.CREATE, {
                    id: id,
                    ...payload
                });
                toast.success("Clock updated successfully");
            } else {
                await axiosInstance.post(API_PATHS.CLOCK.CREATE, payload);
                toast.success("Clock added successfully");
            }

            navigate("/admin/clock");

        } catch (error) {
            console.log("Clock save error", error);
        }

    };
    const getClockById = async () => {
        try {

            const res = await axiosInstance.get(API_PATHS.CLOCK.GET_BY_ID(id));

            if (res.data?.data) {

                const data = res.data.data;


                setFormData({
                    user_id: data.user_id?._id || "",
                    task_id: data.task_id?._id || "",
                    description: data.description || "",
                    in_time: data.in_time
                        ? new Date(data.in_time * 1000).toISOString().slice(0, 16)
                        : "",
                    out_time: data.out_time
                        ? new Date(data.out_time * 1000).toISOString().slice(0, 16)
                        : ""
                });

            }

        } catch (error) {
            console.log("Clock fetch error", error);
        }
    };

    useEffect(() => {

        const loadData = async () => {

            await getUsers();
            await getTasks();

            if (isEditMode) {
                await getClockById();
            }

        };

        loadData();

    }, [id]);



    return (
        <DashboardLayout activeMenu="Clock In/Out">
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-3">

                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-medium">
                                {isEditMode ? "Edit Clock" : "Add Clock"}
                            </h2>
                        </div>

                        {/* User */}
                        <div className="mt-4">
                            <label className="text-xs font-medium text-slate-600">
                                User
                            </label>
                            <select
                                name="user_id"
                                value={formData.user_id}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select User</option>

                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}

                            </select>
                        </div>

                        {/* Task */}
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                Task
                            </label>
                            <select
                                name="task_id"
                                value={formData.task_id}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="">Select Task</option>

                                {tasks.map((task) => (
                                    <option key={task._id} value={task._id}>
                                        {task.title}
                                    </option>
                                ))}

                            </select>
                        </div>

                        {/* Description */}
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input"
                                rows={3}
                            />
                        </div>

                        {/* In Time */}
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                In Time
                            </label>
                            <input
                                type="datetime-local"
                                name="in_time"
                                value={formData.in_time}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* Out Time */}
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                Out Time
                            </label>
                            <input
                                type="datetime-local"
                                name="out_time"
                                value={formData.out_time}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="add-btn"
                            >
                                Back
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="add-btn"
                            >
                                {isEditMode ? "UPDATE" : "ADD"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Clockform;