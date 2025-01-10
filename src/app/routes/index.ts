import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { PostRoutes } from "../modules/post/post.route";
import { FollowRoutes } from "../modules/follow/follow.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { VoteRoutes } from "../modules/vote/vote.route";
import { CommentRoutes } from "../modules/comment/comment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/posts",
    route: PostRoutes,
  },
  {
    path: "/follows",
    route: FollowRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/votes",
    route: VoteRoutes,
  },
  {
    path: "/comments",
    route: CommentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
