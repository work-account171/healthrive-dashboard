import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Correct type
) {
  try {
    await dbConnect();
    const params = await context.params; // ✅ Await the Promise
    const { id } = params;
    
    const updatedTask = await Task.findByIdAndUpdate(id, { completed: true });
    
    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 }); // ✅ Added return
    }
    
    return NextResponse.json({ message: "Task successfully updated!" }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // ✅ Better error message
  }
}