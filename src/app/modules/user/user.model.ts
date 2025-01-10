import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import { USER_ROLE_LIST } from "./user.constant";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: USER_ROLE_LIST,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<TUser>("User", userSchema);
