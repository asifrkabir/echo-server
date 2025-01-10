/* eslint-disable no-console */
/* eslint-disable  no-unsafe-optional-chaining */
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import { sendResetPasswordEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import {
  encryptPassword,
  getExistingUserByEmail,
  getExistingUserById,
} from "../user/user.utils";
import { TLoginUser, TResetPasswordRequest } from "./auth.interface";
import { createToken, isPasswordValid, verifyToken } from "./auth.utils";

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const existingUser = await getExistingUserByEmail(email);

  if (!existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (existingUser.isSuspended) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your account is currently suspended"
    );
  }

  if (!(await isPasswordValid(password, existingUser?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is incorrect");
  }

  const jwtPayload = {
    userId: (existingUser?._id).toString(),
    name: existingUser?.name,
    email: existingUser?.email,
    profilePicture: existingUser?.profilePicture,
    role: existingUser?.role,
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

  return { accessToken, refreshToken };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const { email } = userData;

  const existingUser = await getExistingUserByEmail(email);

  if (!existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (!(await isPasswordValid(payload.oldPassword, existingUser?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is incorrect");
  }

  const newHashedPassword = await encryptPassword(payload.newPassword);

  await User.findOneAndUpdate(
    {
      email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    }
  );

  return null;
};

const refreshToken = async (refreshToken: string) => {
  // check if the refresh token in valid
  const decoded = verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string
  );

  const { userId } = decoded;

  // checking if the user exists
  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const jwtPayload = { userId: existingUser?.id, role: existingUser?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

const forgotPassword = async (payload: TResetPasswordRequest) => {
  const { email } = payload;

  const existingUser = await getExistingUserByEmail(email);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const jwtPayload = { userId: existingUser?.id, role: existingUser?.role };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_reset_secret as string,
    "10m"
  );

  const resetUILink = `${config.client_url}/reset-password?id=${existingUser.id}&token=${encodeURIComponent(resetToken)}`;

  try {
    console.log(`Sending Email to: ${existingUser.email}`);
    await sendResetPasswordEmail(existingUser.email, resetUILink);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send reset password email"
    );
  }
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  const existingUser = await getExistingUserById(payload.id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const decoded = verifyToken(token, config.jwt_reset_secret as string);

  const { userId, role } = decoded;

  if (payload?.id !== userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const newHashedPassword = await encryptPassword(payload.newPassword);

  await User.findOneAndUpdate(
    {
      _id: userId,
      role,
    },
    {
      password: newHashedPassword,
    }
  );
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
