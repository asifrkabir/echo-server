import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { VoteController } from "./vote.controller";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  VoteController.processVote
);

export const VoteRoutes = router;
