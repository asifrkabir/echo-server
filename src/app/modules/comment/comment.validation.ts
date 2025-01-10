import { z } from "zod";

const createCommentValidationSchema = z.object({
  body: z.object({
    post: z
      .string({
        required_error: "Post is required",
        invalid_type_error: "Post must be a valid string",
      })
      .min(1, { message: "Post is required" }),
    content: z
      .string({
        required_error: "Comment Content is required",
        invalid_type_error: "Comment Content must be a valid string",
      })
      .min(1, { message: "Comment Content is required" }),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: "Comment Content is required",
        invalid_type_error: "Comment Content must be a valid string",
      })
      .min(1, { message: "Comment Content is required" }),
  }),
});

export const CommentValidations = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};
