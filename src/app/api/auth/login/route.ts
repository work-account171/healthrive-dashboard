import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); 
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email }).select('+password'); // Ensure password is selected
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" }, // Same message for security
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" }, // Same message for security
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        // Add any other necessary user data (but avoid sensitive info)
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      { 
        message: `Login successfuly!`,
        user: { 
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/", // Important for cookie to be accessible across all routes
    });

    return response;

  } catch (error) {
  console.error("Login error:", error);

  return NextResponse.json(
    { message: error instanceof Error ? error.message : "Internal server error" },
    { status: 500 }
  );
}
}