import dbConnect from "@/app/lib/db";
import Patient from "@/app/models/Patient";
import { NextResponse } from "next/server";



export async function GET(){
  await dbConnect();
  try {
    const patients=await Patient.find().sort({createdAt:-1})
    return NextResponse.json(patients)
  } catch (err:unknown) {
    return NextResponse.json({error:err},{status:500})
  }


}