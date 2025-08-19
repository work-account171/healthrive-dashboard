// dashboard/page.tsx
"use client";

import TaskCard from "../components/dashboard/TaskCard";

export default function Dashboard() {
  
  async function fetchTasks(){
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}`,{
      method:"GET",

    })
  }

  return (
    <>
      <div className="flex flex-col justify-start items-start gap-6">
        <div className="flex flex-col gap-4 justify-start items-start">
          <h1 className="text-[32px] font-bold">Dashboard Overview</h1>
          <p className="text-[16px]">
            Welcome back, Dr. Chioma. Here's what needs your attention today.
          </p>
        </div>
        <div className="flex justify-start items-start gap-5 w-full">
          <TaskCard bgColor="bg-red-100" borderColor="border-red-400" textColor="text-red-600" text="Overdue Tasks" number={6}/>
          <TaskCard bgColor="bg-yellow-100" borderColor="border-yellow-400" textColor="text-yellow-600" text="Due Today"  number={6}/>
          <TaskCard bgColor="bg-blue-100" borderColor="border-blue-400" textColor="text-blue-600" text="This Week"  number={6}/>
          <TaskCard bgColor="bg-green-100" borderColor="border-green-400" textColor="text-green-600" text="Completed" number={6}/>
        </div>
      </div>
    </>
  );
}
