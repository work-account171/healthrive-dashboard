import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import User, { IUser } from "@/app/models/User";
import bcrypt from "bcryptjs";

interface UpdateRequestBody {
  email: string;
  name?: string;
  password?: string;
}

interface UpdateData {
  name?: string;
  password?: string;
}

// 👇 Helper type guard to detect MongoDB duplicate key error safely
function isMongoDuplicateError(error: unknown): error is { code: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "number" &&
    (error as { code: number }).code === 11000
  );
}

export async function PATCH(req: Request) {
  console.log("🔄 PATCH /api/users/edit-user called");

  await dbConnect();

  try {
    const body: UpdateRequestBody = await req.json();
    const { email, name, password } = body;

    console.log("📝 Update request received:", {
      email,
      name,
      password: password ? "***" : undefined,
    });

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updateData: UpdateData = {};

    if (name) updateData.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    console.log("🔄 Updating user with data:", updateData);

    const updatedUser: IUser | null = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log("✅ User updated successfully:", updatedUser?.name);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser?._id,
          name: updatedUser?.name,
          email: updatedUser?.email,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ Error updating user:", error);

    // ✅ Type-safe check for Mongo duplicate key error
    if (isMongoDuplicateError(error)) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
