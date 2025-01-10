import { Post } from "./post.model";

export const getExistingPostById = async (id: string) => {
  const result = await Post.findOne({ _id: id, isActive: true });

  return result;
};
