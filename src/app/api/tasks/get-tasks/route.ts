

import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextResponse } from "next/server";





export interface ITask extends Document {
  title: string;
  description: string;
  patientName: string;
  completed:boolean;
  categories: string[];
  assignee: string;
  dueDate: Date;
  services: string[];
  priority: "low" | "medium" | "high";
  recurrence: string;
  createdAt: Date;
  updatedAt: Date;
}
import { FilterQuery } from 'mongoose';

export async function GET(req: Request) {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const completed = searchParams.get('completed');
  
  try {
    const filter: FilterQuery<ITask> = {}; 
    
    // Add completion filter if provided
    if (completed !== null) {
      filter.completed = completed === 'true';
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (err: unknown) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}