import httpStatus from "http-status";
import { TImageFiles } from "../../interface/image.interface";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostService } from "./post.service";

const getPostById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PostService.getPostById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post retrieved successfully",
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

const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostService.getAllPosts(req.query);

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
      message: "Posts retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createPost = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await PostService.createPost(
    userId,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await PostService.updatePost(
    id,
    userId,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PostService.deletePost(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post deleted successfully",
    data: result,
  });
});

const togglePostPublish = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PostService.togglePostPublish(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post publish status updated successfully",
    data: result,
  });
});

const getAllPostsForNewsfeed = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await PostService.getAllPostsForNewsfeed(userId, req.query);

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
      message: "Newsfeed Posts retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const getPostByIdForUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await PostService.getPostByIdForUser(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully",
    data: result,
  });
});

const getAllPostsForFollowingNewsfeed = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await PostService.getAllPostsForFollowingNewsfeed(
    userId,
    req.query
  );

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
      message: "Following Newsfeed Posts retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

export const PostController = {
  getPostById,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  togglePostPublish,
  getAllPostsForNewsfeed,
  getPostByIdForUser,
  getAllPostsForFollowingNewsfeed,
};
