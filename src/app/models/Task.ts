import mongoose, { Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  patientName: string;
  completed:boolean;
  categories: string[];
  assignee: string;
  dueDate: Date;
  services: string[];
  priority:  "normal" | "high";
  recurrence: string;
  createdAt: Date;
  updatedAt: Date;
}

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
      enum: [ "normal", "high"],
      default: "normal",
    },
    recurrence: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", TaskSchema);
