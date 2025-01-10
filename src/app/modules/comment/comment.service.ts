import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getExistingUserById } from "../user/user.utils";
import { TComment } from "./comment.interface";
import { getExistingPostById } from "../post/post.utils";
import { Comment } from "./comment.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { commentSearchableFields } from "./comment.constant";
import { getExistingCommentById } from "./comment.utils";

const getAllComments = async (query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(Comment.find().populate("user"), query)
    .search(commentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await commentQuery.modelQuery;
  const meta = await commentQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createComment = async (userId: string, payload: TComment) => {
  const { post } = payload;

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingPost = await getExistingPostById(post.toString());

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  payload.user = existingUser._id;

  const result = await Comment.create(payload);

  return result;
};

const updateComment = async (
  id: string,
  userId: string,
  payload: Partial<TComment>
) => {
  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingComment = await getExistingCommentById(id);

  if (!existingComment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (!existingComment.user.equals(existingUser._id)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to edit this comment"
    );
  }

  const result = await Comment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteComment = async (id: string) => {
  const existingComment = await getExistingCommentById(id);

  if (!existingComment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  const result = await Comment.findByIdAndDelete(id);

  return result;
};

export const CommentService = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
};
