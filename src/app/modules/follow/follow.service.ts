import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getExistingUserById } from "../user/user.utils";
import { Follow } from "./follow.model";
import { TFollow } from "./follow.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { ClientSession } from "mongoose";

const getAllFollows = async (query: Record<string, unknown>) => {
  const followQuery = new QueryBuilder(
    Follow.find().populate("follower following"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await followQuery.modelQuery;
  const meta = await followQuery.countTotal();

  return {
    meta,
    result,
  };
};

const follow = async (followerId: string, toBeFollowedUserId: string) => {
  const follower = await getExistingUserById(followerId);

  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower not found");
  }

  const toBeFollowed = await getExistingUserById(toBeFollowedUserId);

  if (!toBeFollowed) {
    throw new AppError(httpStatus.NOT_FOUND, "User to be followed not found");
  }

  if (follower._id.equals(toBeFollowed._id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "User cannot follow themselves");
  }

  const existingFollow = await Follow.findOne({
    follower: follower,
    following: toBeFollowed,
  });

  if (existingFollow) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already following this user"
    );
  }

  const payload: TFollow = {
    follower: follower._id,
    following: toBeFollowed._id,
  };

  const result = await Follow.create(payload);

  return result;
};

const unfollow = async (followerId: string, toBeUnfollowedUserId: string) => {
  const follower = await getExistingUserById(followerId);

  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower not found");
  }

  const toBeUnfollowed = await getExistingUserById(toBeUnfollowedUserId);

  if (!toBeUnfollowed) {
    throw new AppError(httpStatus.NOT_FOUND, "User to be unfollowed not found");
  }

  if (follower._id.equals(toBeUnfollowed._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User cannot unfollow themselves"
    );
  }

  const existingFollow = await Follow.findOne({
    follower: follower,
    following: toBeUnfollowed,
  });

  if (!existingFollow) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not currently following this user"
    );
  }

  const result = await Follow.findByIdAndDelete(existingFollow._id);

  return result;
};

const deleteAllFollowsByUserId = async (
  userId: string,
  session?: ClientSession
) => {
  const result = await Follow.deleteMany(
    {
      $or: [{ follower: userId }, { following: userId }],
    },
    { session: session || undefined }
  );

  return result.deletedCount;
};

const checkIfUserFollowsAnotherUser = async (
  followerId: string,
  toBeFollowedId: string
) => {
  const follower = await getExistingUserById(followerId);

  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower not found");
  }

  const toBeFollowed = await getExistingUserById(toBeFollowedId);

  if (!toBeFollowed) {
    throw new AppError(httpStatus.NOT_FOUND, "User to be followed not found");
  }

  const result = await Follow.findOne({
    follower: follower,
    following: toBeFollowed,
  });

  if (result) {
    return true;
  } else {
    return false;
  }
};

export const FollowService = {
  getAllFollows,
  follow,
  unfollow,
  deleteAllFollowsByUserId,
  checkIfUserFollowsAnotherUser,
};
