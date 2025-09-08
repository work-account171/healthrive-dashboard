import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { sendEmail } from "@/app/lib/email";



export async function POST(req:NextRequest){
    await dbConnect();
    try {
        const {email}=await req.json();
        console.log(email)
        const user=await User.findOne({email});
        if(!user){
            return NextResponse.json({message:"Email not found! Please enter valid email"},{status:401})
        }
        const resetToken=crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry=Date.now()+3600000;
        user.resetPasswordToken=resetToken;
        user.resetPasswordExpires=resetTokenExpiry;
        await user.save();
        const resetUrl=`${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password?token=${resetToken}`
        const emailSubject="Password Reset Request from Healthrive"
        const emailtext=`You requested a password reset. Please click the following link to reset your password: ${resetUrl}`
        const emailHTML=`<p>You requested a password reset. Please click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
        await sendEmail(email,emailSubject,emailtext,emailHTML);
        return NextResponse.json({message:"Reset link sent to your mailbox"},{status:200})
    } catch (error) {
        console.log(error);
        NextResponse.json({message:"Internal server error"},{status:500})
    }
}