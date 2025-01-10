import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a valid string",
      })
      .min(1, { message: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "Refresh Token is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: "Old Password is required",
        invalid_type_error: "Old Password must be a valid string",
      })
      .min(1, { message: "Old Password is required" }),
    newPassword: z
      .string({
        required_error: "New Password is required",
        invalid_type_error: "New Password must be a valid string",
      })
      .min(1, { message: "New Password is required" }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    id: z
      .string({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a valid string",
      })
      .min(1, { message: "User ID is required" }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z
      .string({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a valid string",
      })
      .min(1, { message: "User ID is required" }),
    newPassword: z
      .string({
        required_error: "New Password is required",
        invalid_type_error: "New Password must be a valid string",
      })
      .min(1, { message: "New Password is required" }),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
