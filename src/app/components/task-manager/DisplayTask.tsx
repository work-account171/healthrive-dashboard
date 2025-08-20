"use client";
import { Check, Edit, Eye, Info, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Toaster from "../Toaster";
import TableShimmer from "./TableShimmer";
type Task = {
  _id: string;
  title: string;
  patientName: string;
  description: string;
  dueDate: Date;
  services: string[];
  categories: string[];
  assignee: string;
  priority: "high" | "normal";
  updatedAt: Date;
};

function DisplayTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [completedTask, setcompletedTasks] = useState();
  const [loading, setLoading] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

  async function fetchTasks() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/get-tasks?completed=false`
    );
    const data = await res.json();
    setTasks(data);
    setLoading(false);
    console.log(data);
  }
  async function stats() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/stats`,
      { method: "GET" }
    );
    const { completedTask, overdueTasks } = await res.json();
    setcompletedTasks(completedTask);
  }
  useEffect(() => {
    fetchTasks();
    stats();
  }, []);

  async function taskDone(id: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/update/${id}`,
      {
        method: "PATCH",
      }
    );
    if (res.ok) {
      setTasks(tasks.filter((task) => task._id !== id));
      setToast({
        message: "Task successfully marked as done!",
        variant: "success",
      });
    }
  }
  function handleDeleteClick(task: Task) {
    setSelectedTask(task);
    if (showModal === false) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
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
      <div
        className={`sidebar ${
          sidebar ? "translate-x-0" : "translate-x-full"
        } fixed transition-transform duration-300 ease-in-out w-1/3 z-10 p-8 flex flex-col gap-6 border border-primary bg-white h-screen top-0 right-0`}
      >
        <button
          onClick={() => {
            setSidebar(false);
            setSelectedTask(null);
          }}
          className="p-2 rounded-md border text-primary border-primary absolute top-6 right-6"
        >
          <X />
        </button>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <h1 className="text-4xl font-bold">{selectedTask?.title}</h1>
            <p className="bg-green-200 rounded-xl text-green-500 px-2.5 py-1.5">
              Active
            </p>
            <p
              className={` rounded-xl ${
                selectedTask?.priority == "high"
                  ? "bg-red-600"
                  : "bg-yellow-300"
              } text-white  px-2.5 py-1.5`}
            >
              {selectedTask?.priority == "high" ? "Urgent" : "Normal"}
            </p>
          </div>
          <p className="text-gray-600 text-[16px]">
            {selectedTask?.description}
          </p>
          <button className="cursor-pointer bg-primary px-4 py-2 rounded-xl w-fit text-white flex gap-2 5">
            <Edit />
            Edit Task
          </button>
        </div>
        <div className="rounded-xl border border-gray-300 p-4 flex flex-col gap-2.5 text-primary w-full">
          <h1 className="text-black text-xl">Task Information</h1>
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] ">
              Assigned to: {""}
              <span className="underline">{selectedTask?.assignee}</span>
            </h1>
            <h1 className="text-[16px]">
              Deadline: {""}
              <span className="font-semibold text-red-500">
                {selectedTask && (
                  <div>
                    {new Date(selectedTask.dueDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                )}
              </span>
            </h1>
          </div>
        </div>
        <div className="rounded-xl border border-gray-300 p-4 flex flex-col gap-2.5 w-full">
          <h1 className="text-black text-xl">Other Information</h1>
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] ">Task Categories: {""}</h1>
            <div className="flex justify-start itmes-start gap-2">
              {selectedTask?.categories.map((category) => {
                return (
                  <div
                    key={category}
                    className="bg-blue-100 px-2 py-1 w-fit text-blue-600 rounded-full"
                  >
                    {category}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] ">Linked services: {""}</h1>
            <div className="flex justify-start itmes-start gap-2">
              {selectedTask?.services.map((service) => {
                return (
                  <div
                    key={service}
                    className="bg-blue-100 px-2 py-1 w-fit text-blue-600 rounded-full"
                  >
                    {service}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl">
        <table className="min-w-full rounded-xl text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 rounded-xl text-black font-medium  text-[16px]">
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
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-white text-sm text-primary rounded-md shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-5 whitespace-nowrap">
                      Urgent tasks have higher priority
                    </div>
                  </div>
                </div>
              </th>
              <th className="pl-16 py-5">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableShimmer />
          ) : (
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
                          : task.priority === "normal"
                          ? "bg-yellow-400 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {`${task.priority === "high" ? "Urgent" : "Normal"}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 ">
                    <div className="flex gap-3 items-center justify-center">
                      <button
                        onClick={() => handleDeleteClick(task)}
                        className="bg-green-500 group relative rounded-lg text-white p-2 cursor-pointer"
                      >
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-sm rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-5">
                          Mark as done
                        </span>
                        <Check />
                      </button>

                      <button
                        onClick={() => {
                          setSidebar(true);
                          setSelectedTask(task);
                        }}
                        className="bg-primary rounded-lg text-white p-2 group relative"
                      >
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-sm rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-5">
                          View
                        </span>
                        <Eye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {showModal && (
        <div className="absolute top-10 right-10  border transition-all duration-500 ease-out opacity-100 translate-y-0 border-primary bg-white p-3 rounded-xl shadow-md">
          <p>
            Are you sure you want to mark this &apos;{selectedTask?.title}&apos;
            task done?
          </p>
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
