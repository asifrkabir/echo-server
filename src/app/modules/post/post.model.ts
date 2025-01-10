import { model, Schema } from "mongoose";
import { TPost } from "./post.interface";
import { POST_CATEGORY_LIST } from "./post.constant";

const postSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: POST_CATEGORY_LIST,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
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

export const Post = model<TPost>("Post", postSchema);
