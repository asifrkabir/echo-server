import { Types } from "mongoose";

export type TVote = {
  user: Types.ObjectId;
  post: Types.ObjectId;
  voteType: "upvote" | "downvote";
};
