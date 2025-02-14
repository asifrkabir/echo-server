import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { parseBody } from "../../middlewares/bodyParser";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import validateRequest from "../../middlewares/validateRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { PostController } from "./post.controller";
import { PostValidations } from "./post.validation";

const router = Router();

router.get(
  "/total-posts",
  auth(USER_ROLE_ENUM.admin),
  PostController.getTotalPosts
);

router.get(
  "/newsfeed/following",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PostController.getAllPostsForFollowingNewsfeed
);

router.get(
  "/newsfeed/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PostController.getPostByIdForUser
);

router.get(
  "/newsfeed",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PostController.getAllPostsForNewsfeed
);

router.get(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PostController.getPostById
);

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PostController.getAllPosts
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  multerUpload.fields([{ name: "postImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidations.createPostValidationSchema),
  PostController.createPost
);

router.put(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  multerUpload.fields([{ name: "postImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidations.updatePostValidationSchema),
  PostController.updatePost
);

router.delete(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PostController.deletePost
);

router.put(
  "/:id/publish",
  auth(USER_ROLE_ENUM.admin),
  validateRequest(PostValidations.togglePostPublishValidationSchema),
  PostController.togglePostPublish
);

export const PostRoutes = router;
