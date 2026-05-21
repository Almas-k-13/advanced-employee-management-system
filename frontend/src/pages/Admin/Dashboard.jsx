import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../context/userContext';

import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import InfoCard from '../../components/Cards/infoCard';
import { addThousandsSeparator } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import DashboardLayout from '../../components/layouts/DashBoardLayout';
const COLORS = ["#22c55e", "#ef4444"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const plan = user?.plan;

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [piChartData, setPieChartData] = useState(null);
  const [barChartData, setbarChartData] = useState(null);


  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );

      if (response.data) {
        setDashboardData(response.data);
      }

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAttendanceStats = async () => {
    try {

      const response = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_ATTENDANCE_STATS
      );

      if (response.data) {
        setPieChartData(response.data.todayAttendance);
        setbarChartData(response.data.last7DaysAttendance);
      }

    } catch (error) {
      console.log("Attendance error:", error);
    }
  };

  const onSeeMore = () => {
    navigate('/admin/tasks')
  }

  useEffect(() => {
    getDashboardData();
    getAttendanceStats();

    return () => { };
  }, []);
  useEffect(() => {
    console.log("Pie:", piChartData);
    console.log("Bar:", barChartData);
  }, [piChartData, barChartData]);

  return <DashboardLayout activeMenu="Dashboard">
    <div className="card my-5">

      <div>
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>

          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
        <InfoCard
          label="Total Tasks"
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.All || 0
          )}
          color="bg-primary"
        />

        <InfoCard
          label="Pending Tasks"
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Pending || 0
          )}
          color="bg-violet-500"
        />

        <InfoCard
          label="In Progress Tasks"
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.InProgress || 0
          )}
          color="bg-cyan-500"
        />

        <InfoCard
          label="Completed Tasks"
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Completed || 0
          )}
          color="bg-lime-500"
        />
      </div>
    </div>

    {plan !== "Basic" && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">

        {/* Pie Chart */}
        <div className="card flex flex-col items-center">

          <h5 className="text-lg mb-4">
            Today Attendance
          </h5>

          {piChartData && (piChartData.present > 0 || piChartData.absent > 0) && (

            <PieChart width={350} height={300}>
              <Pie
                data={[
                  { name: "Present", value: piChartData?.present || 0 },
                  { name: "Absent", value: piChartData?.absent || 0 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                dataKey="value"
                minAngle={10}
                isAnimationActive={false}
              >
                {[
                  { name: "Present", value: piChartData?.present || 0 },
                  { name: "Absent", value: piChartData?.absent || 0 }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

          )}

        </div>


        {/* Bar Chart */}
        <div className="card">

          <h5 className="text-lg mb-4">
            Last 7 Days Attendance
          </h5>

          {barChartData && barChartData.length > 0 && (

            <BarChart
              width={400}
              height={250}
              data={barChartData}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickFormatter={(date) => moment(date).format("ddd")}
              />
              <YAxis />

              <Tooltip />

              <Bar
                dataKey="presentCount"
                fill="#3b82f6"
                isAnimationActive={false}
              />

            </BarChart>

          )}

        </div>

      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
      <div className="md:col-span-2">
        <div className="card">
          <div className="flex items-center justify-between ">
            <h5 className="text-lg">Recent Tasks</h5>

            <button className="card-btn" onClick={onSeeMore}>
              See All <LuArrowRight className="text-base" />
            </button>
          </div>
          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </div>


  </DashboardLayout>;

};

export default Dashboard