'use client'
import { Check, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react'
type Task = {
  title: string;
  patientName: string;
  dueDate: string;
  assignee: string;
  priority: 'high' | 'low' | 'medium';
};


function DisplayTask() {
    const [tasks,setTasks]=useState<Task[]>([])
     async function fetchTasks(){
                const res= await fetch("/api/tasks/get-tasks");
                const data=await res.json();
                setTasks(data);
                console.log(data)
            }
        useEffect(()=>{
           fetchTasks();
        },[])

    




  return (
    <>
      <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full rounded-xl text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-black font-medium  text-[16px]">
          <tr>
            <th className="px-6 py-5">Task</th>
            <th className="px-6 py-5">Patient</th>
            <th className="px-6 py-5">Due Date</th>
            <th className="px-6 py-5">Assignee</th>
            <th className="px-6 py-5">Status</th>
            <th className="pl-16 py-5">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {tasks.map((task, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="px-6 py-4">{task.title}</td>
              <td className="px-6 py-4">{task.patientName}</td>
              <td className="px-6 py-4">{new Date(task.dueDate).toLocaleDateString('en-US',{
                year:"numeric",
                month:"long",
                day:"numeric"

              })}</td>
              <td className="px-6 py-4">{task.assignee}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high'
                      ? 'bg-green-100 text-green-700'
                      : task.priority === 'low'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {task.priority}
                </span>
              </td>
              <td className="px-6 py-4 ">
                <div className="group flex relative gap-3 items-center justify-center">
                  <p className='bg-white rounded-lg p-1 absolute -top-5 left-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>Mark as done</p>
                <button className="bg-green-500 rounded-lg text-white p-2 cursor-pointer">
                  <Check/>
                </button>
                <button className="bg-primary rounded-lg text-white p-2">
                  <Eye/>
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default DisplayTask