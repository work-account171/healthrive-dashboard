import dbConnect from "@/app/lib/db";
import Patient from "@/app/models/Patient";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const params = await context.params;
    const { id } = params;
    const body = await req.json();

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedPatient },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

