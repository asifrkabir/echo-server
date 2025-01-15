import { Types } from "mongoose";

export type TGroup = {
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  members: Array<{
    userId: Types.ObjectId;
    joinedAt: Date;
    role: "admin" | "member";
  }>;
  isActive: boolean;
};
