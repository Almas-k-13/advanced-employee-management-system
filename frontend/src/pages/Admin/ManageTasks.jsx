import React, { useEffect, useState } from 'react'
import DashBoardLayout from '../../components/layouts/DashBoardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';


const ManageTasks = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const canAddTask = user?.role?.permissions?.task?.add;
  const userRole = user?.role?.role;

  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Map Status Summary data with fixed label and order
      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
      // console.log(response.data.statusSummary);
    } catch (error) {
      console.error("Error Fetching users:", error);
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => { };
  }, [filterStatus]);


  const handleClick = (taskData) => {
    ///
    if (userRole === "Employee") {
      navigate(`/user/task-details/${taskData._id}`);
    } 
    else if (userRole === "Admin") {
      navigate(`/admin/create-task`, {
        state: {
          taskId: taskData._id
        }
      });
    }
  };
  return (
    <DashBoardLayout activeMenu="Tasks" >
      <div className='my-5'>
        <div className='flex flex-col md:flex-row md:items-center justify-between'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-xl md:text-xl font-medium'>My Task</h2>
          </div>

          <div className="flex items-center gap-3">

            {/* Show tabs only if tasks exist */}
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            

            {/* Add button should always be visible */}
            {canAddTask && (
              <button
                onClick={() => navigate("/admin/create-task")}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md cursor-pointer"
              >
                + Add
              </button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allTasks?.map((item, index) => (

            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => {
                handleClick(item);
              }}
            />
          ))}

        </div>
      </div>
    </DashBoardLayout >
  )
}

export default ManageTasks