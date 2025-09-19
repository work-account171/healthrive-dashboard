import dbConnect from "@/app/lib/db";
import Patient from "@/app/models/Patient";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req:NextRequest,
    context:{params:Promise<{id:string}>}
){
    try {
            await dbConnect();
            const params=await context.params;
            const {id}=params;
            const deleteTask=await Patient.findByIdAndDelete(id);
            if(!deleteTask){
                return NextResponse.json({message:"patient can't found!",status:404})
            }
            return NextResponse.json({message:"patient deleted successfully!",status:200})


    } catch (err:unknown) {
        return NextResponse.json({error:err},{status:500})
    }
    
}