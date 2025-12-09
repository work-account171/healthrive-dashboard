// import { model, models, Schema } from "mongoose";

// const UserSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: ["super-admin", "admin", "virtual-assistant", "front-desk","billing-team","pharmacy-team"],
//     },
//     permissions: { type: [String], default: [] },
//     resetPasswordToken:{type:String},
//     resetPasswordExpires:{type:Date}
//   },
//   { timestamps: true }
// );

// export default models.User||model("User",UserSchema);

import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: "super-admin" | "admin" | "virtual-assistant" | "front-desk" | "billing-team" | "pharmacy-team";
  permissions: string[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "super-admin",
        "admin",
        "virtual-assistant",
        "medical-assistant",
      ],
    },
    permissions: { type: [String], default: [] },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
