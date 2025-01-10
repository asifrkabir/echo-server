import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interface/image.interface";
import { TPost } from "./post.interface";
import { Post } from "./post.model";
import { getExistingPostById } from "./post.utils";
import { getExistingUserById } from "../user/user.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { postSearchableFields } from "./post.constant";
import { Payment } from "../payment/payment.model";
import { Vote } from "../vote/vote.model";
import { Follow } from "../follow/follow.model";

const getPostById = async (id: string) => {
  const result = await Post.findOne({ _id: id, isActive: true });

  return result;
};

const getAllPosts = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find({ isActive: true }).populate("author"),
    query
  )
    .search(postSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createPost = async (
  authorId: string,
  payload: TPost,
  images: TImageFiles
) => {
  const existingAuthor = await getExistingUserById(authorId);

  if (!existingAuthor) {
    throw new AppError(httpStatus.NOT_FOUND, "Author not found");
  }

  payload.author = existingAuthor._id;

  const { postImages } = images;

  if (postImages && postImages.length > 0) {
    payload.imageUrls = postImages.map((image) => image.path);
  }

  payload.upvotes = 0;
  payload.downvotes = 0;

  const result = await Post.create(payload);

  return result;
};

const updatePost = async (
  postId: string,
  userId: string,
  payload: Partial<TPost>,
  images: TImageFiles
) => {
  const existingPost = await getExistingPostById(postId);

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!existingPost.author.equals(existingUser._id)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this post"
    );
  }

  let existingImageUrls: string[] = [];
  let newImageUrls: string[] = [];

  if (payload.imageUrls && payload.imageUrls.length > 0) {
    existingImageUrls = payload.imageUrls;
  }

  const { postImages } = images;

  if (postImages && postImages.length > 0) {
    newImageUrls = postImages.map((image) => image.path);
  }

  const finalImageUrls = [...existingImageUrls, ...newImageUrls];
  payload.imageUrls = finalImageUrls;

  const result = await Post.findOneAndUpdate({ _id: postId }, payload, {
    new: true,
  });

  return result;
};

const deletePost = async (id: string) => {
  const existingPost = await getExistingPostById(id);

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const result = await Post.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  return result;
};

const togglePostPublish = async (id: string, payload: Partial<TPost>) => {
  const existingPost = await getExistingPostById(id);

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const isPublished = payload.isPublished;

  const newPublishStatus =
    isPublished !== undefined ? isPublished : !existingPost.isPublished;

  const result = await Post.findByIdAndUpdate(
    id,
    { isPublished: newPublishStatus },
    { new: true }
  );

  return result;
};

const getAllPostsForNewsfeed = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const postQuery = new QueryBuilder(
    Post.find({ isActive: true, isPublished: true }).populate("author"),
    query
  )
    .search(postSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const posts = await postQuery.modelQuery;

  const purchasedPosts = await Payment.find({
    user: userId,
    status: "successful",
  }).select("post");

  const purchasedPostIds = new Set(
    purchasedPosts.map((payment) => payment.post.toString())
  );

  const userVotes = await Vote.find({ user: userId }).select("post voteType");

  const userVoteMap = userVotes.reduce<Record<string, string>>((acc, vote) => {
    acc[vote.post.toString()] = vote.voteType;
    return acc;
  }, {});

  const result = posts.map((post) => {
    const postId = post._id.toString();
    const isAuthor = userId === post.author._id.toString();

    return {
      ...post.toObject(),
      isPurchased: post.isPremium
        ? isAuthor || purchasedPostIds.has(postId)
        : true, // Non-premium posts are always 'purchased'
      voteType: userVoteMap[postId] || "none",
    };
  });

  const meta = await postQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getPostByIdForUser = async (postId: string, userId: string) => {
  const post = await Post.findOne({
    _id: postId,
    isActive: true,
    isPublished: true,
  })
    .populate("author")
    .lean();

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const purchasedPost = await Payment.findOne({
    user: userId,
    post: postId,
    status: "successful",
  }).select("post");

  const isAuthor = userId === post.author._id.toString();

  const isPurchased = post.isPremium ? isAuthor || !!purchasedPost : true;

  const userVote = await Vote.findOne({ user: userId, post: postId }).select(
    "voteType"
  );

  const voteType = userVote ? userVote.voteType : "none";

  return {
    ...post,
    isPurchased,
    voteType,
  };
};

const getAllPostsForFollowingNewsfeed = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const following = await Follow.find({ follower: userId }).select("following");

  const followingIds = following.map((follow) => follow.following.toString());

  const postQuery = new QueryBuilder(
    Post.find({
      isActive: true,
      isPublished: true,
      author: { $in: followingIds },
    }).populate("author"),
    query
  )
    .search(postSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const posts = await postQuery.modelQuery;

  const purchasedPosts = await Payment.find({
    user: userId,
    status: "successful",
  }).select("post");

  const purchasedPostIds = new Set(
    purchasedPosts.map((payment) => payment.post.toString())
  );

  const userVotes = await Vote.find({ user: userId }).select("post voteType");

  const userVoteMap = userVotes.reduce<Record<string, string>>((acc, vote) => {
    acc[vote.post.toString()] = vote.voteType;
    return acc;
  }, {});

  const result = posts.map((post) => {
    const postId = post._id.toString();
    const isAuthor = userId === post.author._id.toString();

    return {
      ...post.toObject(),
      isPurchased: post.isPremium
        ? isAuthor || purchasedPostIds.has(postId)
        : true, // Non-premium posts are always 'purchased'
      voteType: userVoteMap[postId] || "none",
    };
  });

  const meta = await postQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const PostService = {
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
