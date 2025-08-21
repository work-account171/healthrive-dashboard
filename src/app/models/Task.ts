// 



import mongoose, { Schema } from "mongoose";

// Define the interface for file attachments
export interface IAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface ITask extends Document {
  title: string;
  description: string;
  patientName: string;
  completed: boolean;
  categories: string[];
  assignee: string;
  dueDate: Date;
  services: string[];
  priority: "normal" | "high";
  recurrence: string;
  attachments: IAttachment[]; // Add this field
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    patientName: { type: String, required: true },
    completed: {
      type: Boolean,
      default: false,
    },
    categories: [{ type: String }],
    assignee: { type: String },
    dueDate: { type: Date },
    services: [{ type: String }],
    priority: {
      type: String,
      enum: ["normal", "high"],
      default: "normal",
    },
    recurrence: { type: String },
    attachments: [AttachmentSchema] // Add this field
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);