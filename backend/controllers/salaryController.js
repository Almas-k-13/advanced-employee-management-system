const User = require("../models/User");
const Clock = require("../models/Clock");

const getSundays = (year, month) => {

    let sundays = 0;
    const date = new Date(year, month, 1);

    while (date.getMonth() === month) {

        if (date.getDay() === 0) {
            sundays++;
        }

        date.setDate(date.getDate() + 1);
    }

    return sundays;
};

const getSalaryList = async (req, res) => {

    try {

        const loggedUser = await User.findOne({
            _id: req.user._id,
            company_id: req.user.company_id
        }).populate("role");

        const roleName = loggedUser.role?.role;

        let users;
        if (roleName === "Admin") {

            const allUsers = await User.find({
                is_delete: false,
                company_id: req.user.company_id
            }).populate("role");

            // ❗ Admin ko remove kar do
            users = allUsers.filter(u => u.role?.role !== "Admin");

        }
        else {

            users = await User.find({
                _id: loggedUser._id,
                is_delete: false,
                company_id: req.user.company_id
            }).populate("role");

        }

        const { month } = req.query;

        const selectedDate = new Date(month);

        const year = selectedDate.getFullYear();
        const monthIndex = selectedDate.getMonth();

        const startOfMonth = new Date(year, monthIndex, 1);
        const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59);

        const totalDays = new Date(year, monthIndex + 1, 0).getDate();

        const sundays = getSundays(year, monthIndex);

        const result = [];

        for (let user of users) {

            const attendance = await Clock.find({
                user_id: user._id,
                company_id: req.user.company_id,
                in_time: {
                    $gte: Math.floor(startOfMonth.getTime() / 1000),
                    $lte: Math.floor(endOfMonth.getTime() / 1000)
                }
            });

            const presentDays = attendance.length;

            const payableDays = presentDays + sundays;

            const perDaySalary = user.salary / totalDays;

            const payableSalary = Math.round(perDaySalary * payableDays);

            result.push({
                name: user.name,
                role: user.role?.role || "",
                monthlySalary: user.salary,
                payableSalary
            });
        }

        res.json(result);

    } catch (error) {

        console.log(error);
        res.status(500).json({ message: "Salary calculation error" });

    }

};

module.exports = {
    getSundays,
    getSalaryList
}