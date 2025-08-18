import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextResponse } from "next/server";




export async function GET(){
    await dbConnect();
    const tasks=await Task.find({});
    return NextResponse.json(tasks)


}