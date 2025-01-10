import { Types } from "mongoose";

export type TPost = {
  title: string;
  content: string;
  author: Types.ObjectId;
  category: "tip" | "story";
  isPremium: boolean;
  upvotes: number;
  downvotes: number;
  tags?: string[];
  imageUrls?: string[];
  isPublished: boolean;
  isActive: boolean;
};
