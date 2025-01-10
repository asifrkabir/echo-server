import { Types } from "mongoose";

export type TComment = {
  post: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
};
