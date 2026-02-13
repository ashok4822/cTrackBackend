import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../../domain/entities/User";

export interface IUserDocument extends Document {
  email: string;
  password?: string;
  role: UserRole;
  name?: string;
  googleId?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "operator", "customer"],
      required: true,
    },
    name: { type: String },
    googleId: { type: String, sparse: true, unique: true },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
