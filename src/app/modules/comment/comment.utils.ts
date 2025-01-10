import { Comment } from "./comment.model";

export const getExistingCommentById = async (id: string) => {
  const result = await Comment.findById(id);

  return result;
};
