import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function GET(){
    await dbConnect();
      const count = await User.countDocuments();

    return NextResponse.json({ok:true,users:count})

}