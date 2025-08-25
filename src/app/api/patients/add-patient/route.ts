import dbConnect from "@/app/lib/db";
import Patient from "@/app/models/Patient";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    await dbConnect();
    const body=await req.json();
    try {
        const patient=await Patient.create(body)
        return NextResponse.json({success:true,data:patient},{status:201})
    } catch (error:unknown) {
        return NextResponse.json({success:false,error},{status:400})
    }

}