"use client";
import { Check, Eye, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import Toaster from "../Toaster";
type Task = {
  _id:string,
  title: string;
  patientName: string;
  dueDate: string;
  assignee: string;
  priority: "high" | "low" | "medium";
};

function DisplayTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{
      message: string;
      variant: "success" | "error" | "warning";
    } | null>(null);
  
  async function fetchTasks() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/get-tasks`
    );
    const data = await res.json();
    setTasks(data);
    console.log(data);
  }
  useEffect(() => {
    fetchTasks();
  }, []);

  async function taskDone(id:string){
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/${id}`,{
      method:"DELETE",
    }
    );
    if(res.ok){
      setTasks(tasks.filter(task=>task._id!==id))
      setToast({ 
        message: "Task successfully done!", 
        variant: "success" 
      });
    }

  }
  function handleDeleteClick(task: Task) {
    setSelectedTask(task);
    setShowModal(true);
  }

  function confirmDelete() {
    if (selectedTask) {
      taskDone(selectedTask._id);
    }
    setShowModal(false);
    setSelectedTask(null);
  }

  function cancelDelete() {
    setShowModal(false);
    setSelectedTask(null);
  }

  return (
    <>
     {toast && (
          <Toaster
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        )}
       
      <div className=" rounded-xl">
        <table className="min-w-full rounded-xl text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-black font-medium  text-[16px]">
            <tr>
              <th className="px-6 py-5">Task</th>
              <th className="px-6 py-5">Patient</th>
              <th className="px-6 py-5">Due Date</th>
              <th className="px-6 py-5">Assignee</th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2">
                  Status
                  <div className="relative group">
                    {/* Lucide Info Icon */}
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer" />

                    {/* Tooltip on hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-white text-sm text-primary rounded-md shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                      Urgent tasks have higher priority
                    </div>
                  </div>
                </div>
              </th>
              <th className="pl-16 py-5">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tasks.map((task, index) => (
              
              <tr
                key={index}
                className="hover:bg-gray-50 text-[16px] transition duration-150"
              >
                <td className="px-6 py-4">{task.title}</td>
                <td className="px-6 py-4">{task.patientName}</td>
                <td className="px-6 py-4">
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">{task.assignee}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-2.5 rounded-xl font-medium ${
                      task.priority === "high"
                        ? "bg-red-600 text-white"
                        : task.priority === "low"
                        ? "bg-yellow-400 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {`${task.priority === "high" ? "Urgent" : "Normal"}`}
                  </span>
                </td>
                <td className="px-6 py-4 ">
                  <div className=" flex gap-3 items-center justify-center">
                    <button onClick={() => handleDeleteClick(task)}  className="bg-green-500 group relative rounded-lg text-white p-2 cursor-pointer">
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-sm rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                        Mark as done
                      </span>
                      <Check />
                    </button>

                    <button className="bg-primary rounded-lg text-white p-2 group relative">
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-sm rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                        View
                      </span>
                      <Eye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
          <div className="absolute top-10 right-10 border border-primary bg-white p-3 rounded-xl shadow-md">
            <p>Are you sure you want to mark this "{selectedTask?.title}" task done?</p>
            <div className="flex gap-2 w-full mt-4">
              <button
                onClick={confirmDelete}
                className="bg-primary w-full text-white hover:bg-red-500 px-4 py-2 rounded-lg cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 w-full px-4 py-2 rounded-lg cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
      )}
    </>
  );
}

export default DisplayTask;
