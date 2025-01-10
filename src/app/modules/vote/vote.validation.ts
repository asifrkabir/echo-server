import { z } from "zod";
import { VOTE_TYPE_LIST } from "./vote.constant";

const createVoteValidationSchema = z.object({
  body: z.object({
    post: z
      .string({
        required_error: "Post is required",
        invalid_type_error: "Post must be a valid string",
      })
      .min(1, { message: "Post is required" }),
    voteType: z.enum([...VOTE_TYPE_LIST] as [string, ...string[]], {
      message: "Please enter a valid vote type",
      required_error: "Vote Type is required",
    }),
  }),
});

export const VoteValidations = {
  createVoteValidationSchema,
};
