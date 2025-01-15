import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { GroupController } from "./group.controller";
import { GroupValidations } from "./group.validation";

const router = Router();

router.get(
  "/for-user",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  GroupController.getGroupsForUser
);

router.get(
  "/:id/members",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  GroupController.getGroupMembers
);

router.get(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  GroupController.getGroupById
);

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  GroupController.getAllGroups
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  validateRequest(GroupValidations.createGroupValidationSchema),
  GroupController.createGroup
);

router.put(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  validateRequest(GroupValidations.updateGroupValidationSchema),
  GroupController.updateGroup
);

router.delete(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  GroupController.deleteGroup
);

router.post(
  "/:id/join",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  GroupController.joinGroup
);

router.post(
  "/:id/leave",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  GroupController.leaveGroup
);

router.delete(
  "/:id/members",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  //   validateRequest(GroupValidations.removeMemberValidationSchema),
  GroupController.removeMember
);

export const GroupRoutes = router;
