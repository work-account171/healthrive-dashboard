import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super-admin", "admin", "virtual-assistant", "front-desk"],
    },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.User||model("User",UserSchema);

