import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Connect to database
    await dbConnect();

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: "super-admin" });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Super admin already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    // Create the new super admin
    const admin = await User.create({
      name: "Dr Chioma",
      email: "drokafor59@gmail.com",
      password: hashedPassword,
      role: "super-admin",
    });

    // Return success response
    return NextResponse.json(
      { message: "Super admin created successfully.", admin },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Type-safe error handling
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error creating super admin.", error: error.message },
        { status: 500 }
      );
    }

    // Fallback for unknown error types
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
