import { NextResponse } from "next/server";


export async function POST(){
   const response=NextResponse.json({message:"successfully loggedout"});
   response.cookies.set("token","",{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    path:"/",
    maxAge:0,
    
   })
   return response
}