import dbConnect from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const name = await body.name;
  const email = await body.email;
  const password = await body.password;

  try {
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists!" },
        { status: 409 }
      );
    } else {
      const user = await User.create({
        ...body,
        password: hashedPassword,
      });
      const emailSubject = "You are invited to work on Healthrive dashboard!";
      const emailtext = `Healthrive dashboard Credentials! `;
      const emailHTML = `Dear ${name},<br>

         We are excited to invite you to assist Dr. Chioma on Healthrive! Below are your login credentials to access the platform:
            <br>
          Email: ${email} <br>
          Password: ${password}
            <br>
            <br>
          For your security, please keep your email and password confidential. If you would like to set a password of your choice, you can easily reset it by clicking on the "Forgot Password" link.
            <br>
          Thank you for joining us, and we look forward to your valuable contributions!
            <br>
          Best regards,<br>
          The Healthrive Team`;
      await sendEmail(email, emailSubject, emailtext, emailHTML);
      return NextResponse.json({ success: true, date: User }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
