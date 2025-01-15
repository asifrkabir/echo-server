import { z } from "zod";

const createPostValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a valid string",
      })
      .min(1, { message: "Title is required" }),
    content: z
      .string({
        required_error: "Content is required",
        invalid_type_error: "Content must be a valid string",
      })
      .min(1, { message: "Content is required" }),
    groupId: z.string().min(1).optional(),
    isPremium: z
      .boolean({
        invalid_type_error: "Is Premium must be a boolean",
      })
      .optional()
      .default(false),
    tags: z
      .array(z.string(), {
        invalid_type_error: "Tags must be an array of strings",
      })
      .optional(),
    imageUrls: z
      .array(z.string(), {
        invalid_type_error: "Image URLs must be an array of strings",
      })
      .optional(),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        invalid_type_error: "Title must be a valid string",
      })
      .optional(),
    content: z
      .string({
        invalid_type_error: "Content must be a valid string",
      })
      .optional(),
    isPremium: z
      .boolean({
        invalid_type_error: "Is Premium must be a boolean",
      })
      .optional(),
    tags: z
      .array(z.string(), {
        invalid_type_error: "Tags must be an array of strings",
      })
      .optional(),
    imageUrls: z
      .array(z.string(), {
        invalid_type_error: "Image URLs must be an array of strings",
      })
      .optional(),
  }),
});

const togglePostPublishValidationSchema = z.object({
  body: z.object({
    isPublished: z
      .boolean({
        invalid_type_error: "Is Published must be a boolean",
      })
      .optional(),
  }),
});

export const PostValidations = {
  createPostValidationSchema,
  updatePostValidationSchema,
  togglePostPublishValidationSchema,
};
