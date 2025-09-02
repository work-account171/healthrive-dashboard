import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req:NextRequest,context:{params:Promise<{id:string}>}){
    try {
        await dbConnect();
        const params=await context.params;
        const {id}=params;

        const deletedUser=await User.findByIdAndDelete(id)
        if(!deletedUser){
            return NextResponse.json({message:"user not found"},{status:404})
        }
        return NextResponse.json({message:"task deleted successfully!"},{status:200})
        
    } catch (err:unknown) {
        return NextResponse.json({error:err},{status:500})
    }
    
}