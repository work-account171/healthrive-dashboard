"use client";
import TableShimmer from "@/app/components/task-manager/TableShimmer";
import {  Eye, Undo2 } from "lucide-react";
import React, { useEffect, useState } from "react";

type Tasks = {
  _id: string;
  title: string;
  patientName: string;
  dueDate: string;
  assignee: string;
  priority: "high" | "normal";
};
function completedTask() {
  const [completedTasks, setCompletedTasks] = useState<Tasks[]>([]);
  const [loading, setLoading] = useState(true);
  async function fetchTasks() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/get-tasks?completed=true`
    );
    const tasks = await res.json();
    setCompletedTasks(tasks);
    setLoading(false);
    console.log(tasks);
  }
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-start items-start gap-6">
        <div className="flex flex-col gap-4 justify-start items-start">
          <h1 className="text-[32px] font-bold">Completed Tasks</h1>
          <p className="text-[16px]">
            Good work, These are the tasks you completed so far!
          </p>
        </div>
        <div className=" flex flex-col w-full justify-start items-start gap-5 ">
          <div className="w-full">
            <table className="w-full text-sm text-left border border-gray-200 shadow-md rounded-3xl">
              <thead className="bg-gray-100  text-black font-medium  text-[16px]">
                <tr>
                  <th className="px-6 py-5">Task</th>
                  <th className="px-6 py-5">Patient</th>
                  <th className="px-6 py-5">Due Date</th>
                  <th className="px-6 py-5">Assignee</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="pl-16 py-5">Actions</th>
                </tr>
              </thead>

              {loading ? (
                <TableShimmer />
              ) : (
                <tbody className="bg-white divide-y  divide-gray-100">
                  {completedTasks.map((task, index) => (
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
                          className={`px-2 py-2.5 rounded-xl font-medium bg-green-400 text-white`}
                        >
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 ">
                        <div className="flex gap-3 items-center justify-center">
                          <button className="bg-green-500 group relative rounded-lg text-white p-2 cursor-pointer">
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-sm rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                              Mark as incomplete
                            </span>
                            <Undo2/>
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
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default completedTask;
