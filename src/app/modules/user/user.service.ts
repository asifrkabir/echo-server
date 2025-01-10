import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { encryptPassword, getExistingUserById } from "./user.utils";
import { USER_ROLE_ENUM, userSearchableFields } from "./user.constant";
import { TImageFiles } from "../../interface/image.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import mongoose from "mongoose";
import { FollowService } from "../follow/follow.service";
import { createToken } from "../auth/auth.utils";
import config from "../../config";

const getUserById = async (id: string) => {
  const result = await User.findOne({ _id: id, isActive: true }).select(
    "-password"
  );

  return result;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({ isActive: true }).select("-password"),
    query
  )
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createUser = async (payload: TUser, images: TImageFiles) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email. Please use a different email address"
    );
  }

  const { itemImages } = images;

  if (itemImages && itemImages.length > 0) {
    payload.profilePicture = itemImages[0]?.path;
  }

  payload.password = await encryptPassword(payload.password);
  payload.role = USER_ROLE_ENUM.user;

  const result = await User.create(payload);

  const jwtPayload = {
    userId: result._id.toString(),
    name: result.name,
    email: result.email,
    profilePicture: result?.profilePicture,
    role: result.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  (result as Partial<TUser>).password = undefined;

  return { accessToken, refreshToken, user: result };
};

const updateUser = async (
  id: string,
  payload: Partial<TUser>,
  images: TImageFiles
) => {
  const existingUser = await getExistingUserById(id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const { itemImages } = images;

  // New Profile Picture
  if (itemImages && itemImages.length > 0) {
    payload.profilePicture = itemImages[0]?.path;
  } else if (payload.profilePicture === null) {
    // Remove Profile Picture
    payload.profilePicture = "";
  }

  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  (result as Partial<TUser>).password = undefined;

  return result;
};

const deleteUser = async (id: string) => {
  const existingUser = await getExistingUserById(id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, session }
    );

    await FollowService.deleteAllFollowsByUserId(id, session);

    await session.commitTransaction();
    await session.endSession();

    return deletedUser;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

export const UserService = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
