import { model, Schema } from "mongoose";
import { TVote } from "./vote.interface";
import { VOTE_TYPE_LIST } from "./vote.constant";

const voteSchema = new Schema<TVote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    voteType: {
      type: String,
      enum: VOTE_TYPE_LIST,
      required: true,
    },
  },
  { timestamps: true }
);

export const Vote = model<TVote>("Vote", voteSchema);
