import mongoose, { Schema } from "mongoose";

export interface IAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}
export interface IPatient extends Document{
    id:string,
    name:string,
    clientId:String,
    firstName:string,
    lastName:string,
    description:string,
    email:string,
    phNumber:string,
    priority:"safe"|"emergency",
    attachments: IAttachment,
    createdAt:Date,
    updatedAt:Date,

}
const AttachmentSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});


const PatientSchema:Schema=new Schema(
    {
        firstName:{type:String},
        lastName:{type:String},
        clientId:{type:String},
        name:{type:String},
        description:{type:String},
        email:{type:String},
        phNumber:{type:String},
        priority:{
            type:String,
            enum:["safe","emergency"],
            default:"safe"
        },
        attachments:[AttachmentSchema]

    },
    {timestamps:true}
)

export default mongoose.models.Patient||
mongoose.model<IPatient>("Patient",PatientSchema)