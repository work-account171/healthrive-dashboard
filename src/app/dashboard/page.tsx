// dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import TaskCard from "../components/dashboard/TaskCard";
import NumberShimmer from "../components/dashboard/NumberShimmer";
import ToolCard from "../components/linked-tools/ToolCard";
import icon2 from "@/../public/icons/Icon2.svg";
import icon3 from "@/../public/icons/Icon3.svg";
import icon4 from "@/../public/icons/Icon4.svg";
import icon6 from "@/../public/icons/Icon6.svg";

const tools = [
    {
      icon: "/icons/Icon.svg",
      title: "My Website",
      subheading: "healthrivemedical.com",
      tags: ["Healthrive website link"],
      link:"https://www.healthrivemedical.com/"
    },
    {
      icon: "/icons/Icon.svg",
      title: "Healthie",
      subheading: "EMR & Patient Scheduling",
      tags: ["Clinical", "HIPAA", "Critical", "EMR", "Scheduling"],
      link:"https://secure.gethealthie.com/users/sign_in"
    },
    {
      icon: icon2,
      title: "Spruce",
      subheading: "Patient Communication & Fax",
      tags: ["Communication", "HIPAA", "Critical", "Fax"],
      link:"https://app.sprucehealth.com/login"
    },
    {
      icon: icon3,
      title: "Stripe",
      subheading: "Payment Processing & Billing",
      tags: ["Administrative", "Critical", "Billing", "Payment"],
      link:"https://dashboard.stripe.com/login"
    },
    {
      icon: icon4,
      title: "Google Calendar",
      subheading: "Appointment Scheduling",
      tags: ["Clinical", "Critical", "Calendar", "Scheduling"],
      link:"https://calendar.google.com/calendar/u/0/r"
    },
    {
      icon: icon6,
      title: "Gmail/Enguard",
      subheading: "HIPAA-Compliant Email",
      tags: ["Clinical", "HIPAA", "Critical", "Email"],
      link:"https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox"
    },
  ]

export default function Dashboard() {
  const [taskToday, setTodayTask] = useState();
  const [taskWeek, settaskWeek] = useState();
  const [totalTasks, settotalTasks] = useState();
  const [completedTask, setcompletedTasks] = useState();
  const [loading,setLoading]=useState(true)

  async function fetchTasks() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/stats`,
      {
        method: "GET",
      }
    );
    const { tasksToday, tasksThisWeek, overdueTasks,totalTasks,completedTasks } = await res.json();


    setTodayTask(tasksToday);
    settaskWeek(tasksThisWeek);
    settotalTasks(totalTasks);
    setcompletedTasks(completedTasks);
    setLoading(false)
  }
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-start items-start gap-6">
        <div className="flex flex-col gap-4 justify-start items-start">
          <h1 className="text-[32px] font-bold">Dashboard Overview</h1>
          <p className="text-[16px]">
            Welcome back, Dr. Chioma. Here&apos;s what needs your attention today.
          </p>
        </div>
        <div className="flex justify-start items-start gap-5 w-full">
          <TaskCard
            bgColor="bg-red-100"
            borderColor="border-red-400"
            textColor="text-red-600"
            text="Overdue Tasks"
            link="/dashboard/task-manager"
            number={loading?<NumberShimmer/>:totalTasks}
          />
          <TaskCard
            bgColor="bg-yellow-100"
            borderColor="border-yellow-400"
            textColor="text-yellow-600"
            text="Due Today"
            link="/dashboard/due-today"
            number={loading?<NumberShimmer/>:taskToday}
          />
          <TaskCard
            bgColor="bg-blue-100"
            borderColor="border-blue-400"
            textColor="text-blue-600"
            text="This Week"
            link="/dashboard/due-week"
            number={loading?<NumberShimmer/>:taskWeek}
          />
          <TaskCard
            bgColor="bg-green-100"
            borderColor="border-green-400"
            textColor="text-green-600"
            text="Completed"
            link="/dashboard/completed-tasks"
            number={loading?<NumberShimmer/>:completedTask}
          />
        </div>
        <div className="flex flex-col gap-5 justify-start items-start">
          <h1 className="text-2xl font-bold">Quick Access Tools</h1>
            <div className="flex flex-wrap justify-between itmes-start gap-y-4">
              
              {tools.map((tool,index)=>{
                return(
                    <ToolCard
                              key={index}
                              icon={tool.icon}
                              title={tool.title}
                              subheading={tool.subheading}
                              tags={tool.tags}
                              link={tool.link}
                            />
                )
              })
            }
            </div>
        </div>
      </div>
    </>
  );
}
