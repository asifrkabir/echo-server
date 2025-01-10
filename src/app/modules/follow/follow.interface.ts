import { Types } from "mongoose";

export type TFollow = {
  follower: Types.ObjectId;
  following: Types.ObjectId;
};
