const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");
const Clock = require("../models/Clock");

// @desc Export all tasks as an Excel file
// @route GET /api/reports/export/tasks
// @access Private (Admin)
const exportTasksReport = async (req, res) => {
    try {
        // const tasks = await Task.find().populate("assignedTo", "name email");
        const role = req.user.role.role;

        let tasks;

        if (role === "Admin" || role === "Manager") {

            tasks = await Task.find({
                company_id: req.user.company_id
            }).populate("assignedTo", "name email");

        } else {

            tasks = await Task.find({
                assignedTo: req.user._id,
                company_id: req.user.company_id
            })

        }

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");
        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo

                .map((user) => `${user.name} (${user.email})`)
                .join(", ");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split("T")[0],
                assignedTo: assignedTo || "Unassigned",
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="tasks_report.xlsx"'
        );

        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error exporting tasks", error: error.message });
    }

};

// @desc Export user-task report as an Excel file
// @route GET /api/reports/export/users
// @access Private (Admin)
const exportUsersReport = async (req, res) => {
    try {
        // const users = await User.find().select("name email _id").lean();
        const role = req.user.role.role;

        let users;

        if (role === "Admin" || role === "Manager") {

            users = await User.find({
                company_id: req.user.company_id
            }).select("name email _id").lean();

        } else {

            users = await User.find({
                company_id: req.user.company_id
            }).select("name email _id").lean();

        }

        const userTasks = await Task.find({ company_id: req.user.company_id }).populate(
            "assignedTo",
            "name email_id"
        );

        const userTaskMap = {};

        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach((task) => {

            if (task.assignedTo) {
                {
                    task.assignedTo.forEach((assignedUser) => {
                        if (userTaskMap[assignedUser._id]) {
                            userTaskMap[assignedUser._id].taskCount += 1;
                            if (task.status === "Pending") {
                                userTaskMap[assignedUser._id].pendingTasks += 1;
                            } else if (task.status === "In Progress") {
                                userTaskMap[assignedUser._id].inProgressTasks += 1;
                            } else if (task.status === "Completed") {
                                userTaskMap[assignedUser._id].completedTasks += 1;
                            }
                        }
                    });
                }
            }

        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pending Tasks", width: 20 },
            {
                header: "In Progress Tasks",
                key: "inProgressTasks",
                width: 20,
            },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];
        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="users_report.xlsx"'
        );

        return workbook.xlsx.write(res).then(() => {
            res.end();
        });


    } catch (error) {
        res
            .status(500)
            .json({ message: "Error exporting tasks", error: error.message });
    }
};

// @desc Export attendance report as Excel
// @route GET /api/reports/export/attendance
// @access Private (Admin)

const exportAttendanceReport = async (req, res) => {

    try {
        const role = req.user.role.role;

        let clocks;

        if (role === "Admin" || role === "Manager") {

            clocks = await Clock.find({
                company_id: req.user.company_id
            })
                .populate("user_id", "name email")
                .populate("task_id", "title")
                .sort({ created_at: -1 });

        } else {

            clocks = await Clock.find({
                user_id: req.user._id,
                company_id: req.user.company_id
            })
                .populate("user_id", "name email")
                .populate("task_id", "title")
                .sort({ created_at: -1 });
        }

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Attendance Report");

        worksheet.columns = [
            { header: "Employee Name", key: "name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Task", key: "task", width: 30 },
            { header: "Clock In Time", key: "in_time", width: 20 },
            { header: "Clock Out Time", key: "out_time", width: 20 },
            { header: "Description", key: "description", width: 40 },
            { header: "Location", key: "location", width: 20 },
            { header: "Date", key: "date", width: 20 }
        ];

        clocks.forEach((item) => {

            worksheet.addRow({

                name: item.user_id?.name || "Unknown",
                email: item.user_id?.email || "Unknown",
                task: item.task_id?.title || "Unknown",

                in_time: new Date(item.in_time * 1000).toLocaleTimeString(),
                out_time: item.out_time
                    ? new Date(item.out_time * 1000).toLocaleTimeString()
                    : "-",

                description: item.description || "-",
                location: item.location || "-",

                date: item.created_at.toISOString().split("T")[0]

            });

        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="attendance_report.xlsx"'
        );

        return workbook.xlsx.write(res).then(() => {
            res.end();
        });

    } catch (error) {

        res.status(500).json({
            message: "Error exporting attendance report",
            error: error.message
        });

    }

};

module.exports = {
    exportTasksReport,
    exportUsersReport,
    exportAttendanceReport

};