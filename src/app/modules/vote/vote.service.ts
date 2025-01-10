import mongoose from "mongoose";
import { TVote } from "./vote.interface";
import { Vote } from "./vote.model";
import { getExistingUserById } from "../user/user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { getExistingPostById } from "../post/post.utils";
import { Post } from "../post/post.model";
import { VOTE_TYPE_ENUM } from "./vote.constant";

const processVote = async (userId: string, payload: TVote) => {
  const { post, voteType } = payload;

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingPost = await getExistingPostById(post.toString());

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingVote = await Vote.findOne({ user: userId, post: post });

    if (!existingVote) {
      // If no existing vote, create a new one and increment upvote/downvote count in Post
      payload.user = existingUser._id;

      const newVote = await Vote.create([payload], { session });

      if (!newVote.length) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create new vote");
      }

      // Update the Post upvote or downvote count
      if (voteType === VOTE_TYPE_ENUM.UPVOTE) {
        await Post.findByIdAndUpdate(
          post,
          { $inc: { upvotes: 1 } },
          { session }
        );
      } else {
        await Post.findByIdAndUpdate(
          post,
          { $inc: { downvotes: 1 } },
          { session }
        );
      }
    } else {
      // Handle vote removal or switching vote types
      if (existingVote.voteType === voteType) {
        // If user clicks the same voteType (i.e., remove vote)
        const deletedVote = await Vote.findByIdAndDelete(existingVote._id, {
          session,
        });

        if (!deletedVote) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Failed to remove existing vote"
          );
        }

        if (voteType === VOTE_TYPE_ENUM.UPVOTE) {
          await Post.findByIdAndUpdate(
            post,
            { $inc: { upvotes: -1 } },
            { session }
          );
        } else {
          await Post.findByIdAndUpdate(
            post,
            { $inc: { downvotes: -1 } },
            { session }
          );
        }
      } else {
        // If user switches the vote (e.g., upvote -> downvote)
        const prevVoteType = existingVote.voteType;

        const updatedVote = await Vote.findByIdAndUpdate(
          existingVote._id,
          payload,
          { session }
        );

        if (!updatedVote) {
          throw new AppError(httpStatus.BAD_REQUEST, "Failed to switch vote");
        }

        if (prevVoteType === VOTE_TYPE_ENUM.UPVOTE) {
          // User had upvoted, now downvotes
          await Post.findByIdAndUpdate(
            post,
            {
              $inc: { upvotes: -1, downvotes: 1 },
            },
            { session }
          );
        } else {
          // User had downvoted, now upvotes
          await Post.findByIdAndUpdate(
            post,
            {
              $inc: { upvotes: 1, downvotes: -1 },
            },
            { session }
          );
        }
      }
    }

    await session.commitTransaction();
    await session.endSession();

    return { message: "Vote processed successfully" };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Error processing vote"
      );
    }
  }
};

export const VoteService = {
  processVote,
};
