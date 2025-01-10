import { z } from "zod";
import { PAYMENT_STATUS_LIST } from "./payment.constant";

const createPostValidationSchema = z.object({
  body: z.object({
    post: z
      .string({
        required_error: "Post is required",
        invalid_type_error: "Post must be a valid string",
      })
      .min(1, { message: "Post is required" }),
    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a valid number",
      })
      .min(1, { message: "Amount must be at least $1" }),
    status: z
      .enum([...PAYMENT_STATUS_LIST] as [string, ...string[]], {
        message: "Please enter a valid status",
      })
      .optional(),
  }),
});

export const PaymentValidations = {
  createPostValidationSchema,
};
