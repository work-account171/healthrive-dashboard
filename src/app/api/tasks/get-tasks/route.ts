import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextResponse } from "next/server";




export async function GET(){
    await dbConnect();
    const tasks=await Task.find({}).sort({createdAt:-1});
    return NextResponse.json(tasks)


}