import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    await dbConnect();
    const body=await req.json();

    try {
        const task=await Task.create(body);
        return NextResponse.json({success:true,data:task},{status:201})
    } catch (error:unknown) {
        return NextResponse.json({success:false,error},{status:400})
    }
}