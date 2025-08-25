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
    carePhase:string,
    description:string,
    assignee:string,
    dueDate: Date,
    categories:string[],
    services:string[],
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
        name:{type:String,required:true},
        description:{type:String},
        carePhase:{type:String},
        categories:[{type:String}],
        assignee:{type:String},
        dueDate:{type:Date},
        services:[{type:String}],
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