import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextResponse } from "next/server";
import { FilterQuery } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  patientName: string;
  completed: boolean;
  categories: string[];
  assignee: string;
  dueDate: Date;
  services: string[];
  priority: "low" | "medium" | "high";
  recurrence: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const completed = searchParams.get("completed");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "0");

  try {
    const filter: FilterQuery<ITask> = {};

    if (completed !== null) {
      filter.completed = completed === "true";
    }

    const total = await Task.countDocuments(filter);
    let query = Task.find(filter).sort({ createdAt: -1 }).lean();

    if (limit > 0) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const tasks = await query;

    // Map priority to match frontend's Task type
    const mappedTasks = tasks.map((task) => ({
      ...task,
      priority: task.priority === "low" || task.priority === "medium" ? "normal" : task.priority,
    }));

    return NextResponse.json({
      tasks: mappedTasks,
      currentPage: page,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      total,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}