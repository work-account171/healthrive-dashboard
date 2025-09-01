import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    await dbConnect();
    const body=await req.json();
    const hashedPassword=await bcrypt.hash(body.password,10);
    
    try {
        const existingUser=await User.findOne({email:body.email})
        if(existingUser){
            return NextResponse.json({message:"User already exists!"},{status:409})
        }
        else{
            const user=await User.create({
                ...body,
                password:hashedPassword
            })
            return NextResponse.json({success:true,date:User},{status:201})
        }
        
    } catch (error) {
        return NextResponse.json({success:false,error},{status:400})
    }

}