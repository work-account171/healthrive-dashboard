import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextResponse } from "next/server";



export async function GET(){
  await dbConnect();

  const totalTasks=await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ completed: true });

  const today=new Date();
  today.setHours(0,0,0,0);

  const endofToday=new Date(today);
  endofToday.setHours(23,59,59,999);

  const endofWeek=new Date(today);
    endofWeek.setDate(endofWeek.getDate()+(7-endofWeek.getDay()))

    const tasksToday=await Task.countDocuments({
        dueDate:{$gte:today,$lte:endofToday},
    })

    const tasksThisWeek=await Task.countDocuments({
        dueDate:{$gte:today,$lte:endofWeek}
    })

    const overdueTasks=await Task.countDocuments({
        dueDate:{$lt:today},
        completed:false,
    })
    return NextResponse.json({
        tasksToday,
        tasksThisWeek,
        overdueTasks,
        totalTasks,
        completedTasks
    })

}