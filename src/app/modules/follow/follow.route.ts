import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { FollowController } from "./follow.controller";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  FollowController.getAllFollows
);

router.post(
  "/:toBeFollowedUserId",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  FollowController.follow
);

router.delete(
  "/:toBeUnfollowedUserId",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  FollowController.unfollow
);

router.get(
  "/check/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  FollowController.checkIfUserFollowsAnotherUser
);

export const FollowRoutes = router;
