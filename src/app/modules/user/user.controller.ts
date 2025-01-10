import { TImageFiles } from "../../interface/image.interface";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserService.getUserById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: result,
    });
  }
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);

  if (result?.result?.length <= 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "No Data Found",
      meta: result.meta,
      data: result?.result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await UserService.updateUser(
    userId,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserService.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserController = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
