import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { GroupService } from "./group.service";

const getGroupById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await GroupService.getGroupById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Group retrieved successfully",
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Group not found",
      data: result,
    });
  }
});

const getAllGroups = catchAsync(async (req, res) => {
  const result = await GroupService.getAllGroups(req.query);

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
      message: "Groups retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createGroup = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await GroupService.createGroup(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Group created successfully",
    data: result,
  });
});

const updateGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await GroupService.updateGroup(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group updated successfully",
    data: result,
  });
});

const deleteGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await GroupService.deleteGroup(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group deleted successfully",
    data: result,
  });
});

const joinGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await GroupService.joinGroup(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Joined group successfully",
    data: result,
  });
});

const leaveGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await GroupService.leaveGroup(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "You have successfully left the group",
    data: result,
  });
});

const removeMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { memberId } = req.body;
  const { userId } = req.user;

  const result = await GroupService.removeMember(id, userId, memberId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member removed successfully",
    data: result,
  });
});

const getGroupMembers = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await GroupService.getGroupMembers(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group members retrieved successfully",
    data: result,
  });
});

const getGroupsForUser = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await GroupService.getGroupsForUser(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group retrieved successfully",
    data: result,
  });
});

export const GroupController = {
  getGroupById,
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  removeMember,
  getGroupMembers,
  getGroupsForUser,
};
