'use client';

import { useState } from 'react';

export default function EmailNotifications() {
  const [taskAssigned, setTaskAssigned] = useState(true);
  const [taskOverdue, setTaskOverdue] = useState(false);

  return (
    <div className="p-6 border border-gray-200 rounded-xl w-full">
      <h2 className="text-[20px] font-medium mb-4">Email Notifications</h2>

      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between border border-gray-200 rounded-xl w-full gap-[10px] px-[20px] py-[25px] font-outfit">
          <div className='h-fit'>
            <h2 className="text-[20px] font-semibold">Task Assigned</h2>
            <h2 className="text-[16px] font-medium text-gray-600">
              Email when a task is assigned to you
            </h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={taskAssigned}
              onChange={() => setTaskAssigned(!taskAssigned)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary  transition-all duration-300"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5" />
          </label>
        </div>
        <div className="flex items-center justify-between border border-gray-200 rounded-xl w-full gap-[10px] px-[20px] py-[25px] font-outfit">
          <div className='h-fit'>
            <h2 className="text-[20px] font-semibold">Task Overdue</h2>
            <h2 className="text-[16px] font-medium text-gray-600">
              Email when a task becomes overdue
            </h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={taskOverdue}
              onChange={() => setTaskOverdue(!taskOverdue)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary  transition-all duration-300"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5" />
          </label>
        </div>
      </div>
    </div>
  );
}
