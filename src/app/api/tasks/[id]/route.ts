import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest, { params }:{params:{id:string}}) {
  try {
    await dbConnect();
    const { id } = params;
    const deletedTask=await Task.findByIdAndDelete(id)
    if(!deletedTask){
        return NextResponse.json({error:"task not found"},{status:404})
    }
    return NextResponse.json({message:"task successfully deleted"},{status:200})
  } catch (err:unknown) {
    return NextResponse.json({error:err},{status:500})
  }
}
