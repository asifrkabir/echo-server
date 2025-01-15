import { z } from "zod";

const createGroupValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(1, { message: "Name cannot be empty" }),
    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .optional(),
  }),
});

const updateGroupValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Name must be a string",
      })
      .optional(),
    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .optional(),
  }),
});

const addMemberValidationSchema = z.object({
  body: z.object({
    userId: z
      .string({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a string",
      })
      .min(1, { message: "User ID cannot be empty" }),
    role: z
      .enum(["admin", "member"], {
        invalid_type_error: "Role must be 'admin' or 'member'",
      })
      .optional()
      .default("member"),
  }),
});

export const GroupValidations = {
  createGroupValidationSchema,
  updateGroupValidationSchema,
  addMemberValidationSchema,
};
