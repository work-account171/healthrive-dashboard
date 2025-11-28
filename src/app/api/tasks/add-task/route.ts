import dbConnect from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import Task from "@/app/models/Task";
import Patient, { IPatient } from "@/app/models/Patient";
import { NextResponse } from "next/server";

// Helper function to create de-identified patient name
function getDeIdentifiedPatientName(patient: IPatient | null): string {
  if (!patient) {
    return "Patient";
  }
  
  // Prefer clientId if available
  if (patient.clientId) {
    return `Patient ID: ${patient.clientId}`;
  }
  
  // Otherwise use firstName + last initial
  if (patient.firstName && patient.lastName) {
    const lastInitial = patient.lastName.charAt(0).toUpperCase();
    return `${patient.firstName} ${lastInitial}.`;
  }
  
  // Fallback: if only firstName is available
  if (patient.firstName) {
    return patient.firstName;
  }
  
  // Last resort: return generic identifier
  return "Patient";
}

export async function POST(req:Request){
    await dbConnect();
    const body=await req.json();
    console.log('Completed field:', body.completed); 
    console.log("Incoming task data:", body); 
    const title=await body.title;
    const patientName=await body.patientName;
    const email='drokafor59@gmail.com'

    try {
        const task=await Task.create(body);
        
        // Look up patient to get de-identified information
        let deIdentifiedPatientName = "Patient";
        try {
          const patient = await Patient.findOne({ name: patientName });
          if (patient) {
            deIdentifiedPatientName = getDeIdentifiedPatientName(patient);
          }
        } catch (patientError) {
          console.error("Error fetching patient for de-identification:", patientError);
          // If patient lookup fails, use a generic identifier
          deIdentifiedPatientName = "Patient";
        }
        
        const emailSubject = "Task Creation by you!";
              const emailtext = `Healthrive Task Update `;
              const emailHTML = `
  <div style="font-family: Arial, Helvetica, sans-serif; background: #f6f9fc; padding: 20px;">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 25px 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    ">
      
      <h2 style="color: #2e7dff; margin-top: 0; font-weight: 600;">
        Healthrive Task Update
      </h2>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
        Dear <b>Dr Chioma</b>,<br><br>
        Task <b>${title}</b> has been successfully created by you for ${deIdentifiedPatientName}.
      </p>

      <p style="margin-top: 30px; font-size: 14px; color: #555;">
        Regards,<br>
        <b>The Healthrive Team</b>
      </p>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 25px 0;">

      <p style="font-size: 12px; color: #888; text-align: center;">
        Note: This is an auto-generated email. Please do not reply.
      </p>

    </div>
  </div>
`;
              await sendEmail(email, emailSubject, emailtext, emailHTML);
        return NextResponse.json({success:true,data:task},{status:201})
    } catch (error:unknown) {
        return NextResponse.json({success:false,error},{status:400})
    }
}