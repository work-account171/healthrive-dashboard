// import dbConnect from "@/app/lib/db";
// import Task from "@/app/models/Task";
// import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> } 
// ) {
//   try {
//     await dbConnect();
//     const params = await context.params; 
//     const { id } = params;
    
//     const updatedTask = await Task.findByIdAndUpdate(id, { completed: true });
    
//     if (!updatedTask) {
//       return NextResponse.json({ error: "Task not found" }, { status: 404 }); // ✅ Added return
//     }
    
//     return NextResponse.json({ message: "Task successfully updated!" }, { status: 200 });
//   } catch (err: unknown) {
//     return NextResponse.json({ error: err }, { status: 500 }); // ✅ Better error message
//   }
// }
import dbConnect from "@/app/lib/db";
import Task from "@/app/models/Task";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    await dbConnect();
    const params = await context.params; 
    const { id } = params;
    
    // First, get the current task to check its completed status
    const currentTask = await Task.findById(id);
    
    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    // Toggle the completed status
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed: !currentTask.completed }, // Toggle the value
      { new: true } // Return the updated document
    );
    
    return NextResponse.json({ 
      message: "Task status updated successfully!", 
      data: updatedTask 
    }, { status: 200 });
    
  } catch (err: unknown) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    console.log(err)
  }
}