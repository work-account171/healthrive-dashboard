import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    await dbConnect();

    const existingAdmin = await User.findOne({ role: "super-admin" });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "details already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    const admin = await User.create({
      name: "Dr Chioma",
      email: "vork.acount.p171@gmail.com",
      password: hashedPassword,
      role: "super-admin",
    });
    return NextResponse.json(
      { message: "super admin created",admin },
      
    );
  } catch (error:any) {
    return NextResponse.json({message:"error creating super-admin",error:error.message},{status:500})
  }
}
