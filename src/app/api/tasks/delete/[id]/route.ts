import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE( 
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Correct type
) {
  try {
    await dbConnect();
    const params = await context.params; // ✅ Await the Promise
    const { id } = params;
    
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error:err }, { status: 500 });
  }
}