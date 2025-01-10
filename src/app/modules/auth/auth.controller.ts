import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;

  const result = await AuthService.forgotPassword(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link is generated successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const result = await AuthService.resetPassword(req.body, token as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
