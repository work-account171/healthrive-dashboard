
import nodemailer from 'nodemailer'

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    },
})
export async function sendEmail(
    to:string,
    subject:string,
    text:string,
    html:string
){
    try {
        
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    
    console.log('Email sent: ', info.messageId);
    return info;
    } catch (error) {
        console.log("error in seding email",error)
        throw error
    }

}