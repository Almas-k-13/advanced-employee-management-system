import React, { useState, useEffect } from "react";

import axiosInstance from "../../../utils/axiosInstance";
import DashboardLayout from "../../../components/layouts/DashBoardLayout";

const Salary = () => {

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [employees, setEmployees] = useState([]);

  const getLast12Months = () => {

    const months = [];
    const date = new Date();

    for (let i = 0; i < 12; i++) {

      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push(d);

    }

    return months;
  };

  const months = getLast12Months();

  const getSalaryList = async () => {

    try {

      const res = await axiosInstance.get(
        `/salary?month=${selectedMonth.toISOString()}`
      );

      setEmployees(res.data);

    } catch (error) {

      console.log("Salary error", error);

    }

  };

  useEffect(() => {

    getSalaryList();

  }, [selectedMonth]);

  return (

    <DashboardLayout activeMenu="Salary">

      <div className="min-h-screen bg-slate-100 p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold">
            Employee Salary
          </h2>

          <select
            className="border px-4 py-2 rounded-lg"
            onChange={(e) => setSelectedMonth(new Date(e.target.value))}
          >

            {months.map((m, index) => (

              <option key={index} value={m.toISOString()}>

                {m.toLocaleString("default", {
                  month: "long",
                  year: "numeric"
                })}

              </option>

            ))}

          </select>

        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-slate-100 text-slate-600">

              <tr>

                <th className="px-6 py-4 text-left">No</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Monthly Salary</th>
                <th className="px-6 py-4 text-left">Payable Salary</th>

              </tr>

            </thead>

            <tbody>

              {employees.map((emp, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">
                    {emp.name}
                  </td>

                  <td className="px-6 py-4">
                    {emp.role}
                  </td>

                  <td className="px-6 py-4">
                    ₹{emp.monthlySalary}
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    ₹{emp.payableSalary}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>

  );

};

export default Salary;