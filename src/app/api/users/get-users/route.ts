import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";


export  async function GET(){
    await dbConnect();
    try {
        const users=await User.find().sort({createdAt:1});
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json(error)
    }
}