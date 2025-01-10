import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FollowService } from "./follow.service";

const getAllFollows = catchAsync(async (req, res) => {
  const result = await FollowService.getAllFollows(req.query);

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
      message: "Follows retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const follow = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { toBeFollowedUserId } = req.params;

  const result = await FollowService.follow(userId, toBeFollowedUserId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User followed successfully",
    data: result,
  });
});

const unfollow = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { toBeUnfollowedUserId } = req.params;

  const result = await FollowService.unfollow(userId, toBeUnfollowedUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User unfollowed successfully",
    data: result,
  });
});

const checkIfUserFollowsAnotherUser = catchAsync(async (req, res) => {
  const { id: toBeFollowed } = req.params;
  const { userId: followerId } = req.user;

  const result = await FollowService.checkIfUserFollowsAnotherUser(
    followerId,
    toBeFollowed
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow status retrieved successfully",
    data: result,
  });
});

export const FollowController = {
  getAllFollows,
  follow,
  unfollow,
  checkIfUserFollowsAnotherUser,
};
