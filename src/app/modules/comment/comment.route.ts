import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { CommentController } from "./comment.controller";
import { CommentValidations } from "./comment.validation";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  CommentController.getAllComments
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  validateRequest(CommentValidations.createCommentValidationSchema),
  CommentController.createComment
);

router.put(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  validateRequest(CommentValidations.updateCommentValidationSchema),
  CommentController.updateComment
);

router.delete(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  CommentController.deleteComment
);

export const CommentRoutes = router;
