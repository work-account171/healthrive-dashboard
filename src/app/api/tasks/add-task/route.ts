import dbConnect from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import Task from "@/app/models/Task";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    await dbConnect();
    const body=await req.json();
    console.log('Completed field:', body.completed); 
    console.log("Incoming task data:", body); 
    const title=await body.title;
    const patientName=await body.patientName;
    const email='abdurrehman1722@gmail.com'

    try {
        const task=await Task.create(body);
        const emailSubject = "Task Creation by you!";
              const emailtext = `Healthrive Task Update `;
              const emailHTML = `Dear Dr Chioma,<br>
                Task <b>${title}</b> is succesfully created by you for patient name <b> ${patientName}</b>!
                <br>Regards: The Healthrive Team<br>
                Note:This is auto generated email`;
              await sendEmail(email, emailSubject, emailtext, emailHTML);
        return NextResponse.json({success:true,data:task},{status:201})
    } catch (error:unknown) {
        return NextResponse.json({success:false,error},{status:400})
    }
}