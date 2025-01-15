import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { getExistingUserById } from "../user/user.utils";
import { groupSearchableFields } from "./group.constant";
import { TGroup } from "./group.interface";
import { Group } from "./group.model";
import { getExistingGroupById } from "./group.utils";

const getGroupById = async (id: string) => {
  const result = await Group.findOne({ _id: id, isActive: true }).populate(
    "createdBy members.userId"
  );

  return result;
};

const getAllGroups = async (query: Record<string, unknown>) => {
  const groupsQuery = new QueryBuilder(
    Group.find({ isActive: true }).populate("createdBy"),
    query
  )
    .search(groupSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await groupsQuery.modelQuery;
  const meta = await groupsQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createGroup = async (creatorId: string, payload: Partial<TGroup>) => {
  const existingCreator = await getExistingUserById(creatorId);

  if (!existingCreator) {
    throw new AppError(httpStatus.NOT_FOUND, "Creator not found");
  }

  payload.createdBy = existingCreator._id;
  payload.members = [
    { userId: existingCreator._id, joinedAt: new Date(), role: "admin" },
  ];

  const group = await Group.create(payload);

  return group;
};

const updateGroup = async (
  groupId: string,
  userId: string,
  payload: Partial<TGroup>
) => {
  const existingGroup = await getExistingGroupById(groupId);

  if (!existingGroup) {
    throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  }

  const isAdmin = existingGroup.members.some(
    (member) => member.userId.equals(userId) && member.role === "admin"
  );

  if (!isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this group"
    );
  }

  const updatedGroup = await Group.findByIdAndUpdate(groupId, payload, {
    new: true,
  });

  return updatedGroup;
};

const deleteGroup = async (groupId: string, userId: string) => {
  const existingGroup = await getExistingGroupById(groupId);

  if (!existingGroup) {
    throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  }

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    !existingGroup.createdBy.equals(userId) &&
    existingUser.role !== "admin"
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the group creator or a system admin can delete the group"
    );
  }

  const result = await Group.findByIdAndUpdate(
    groupId,
    { isActive: false },
    { new: true }
  );

  return result;
};

const joinGroup = async (groupId: string, userId: string) => {
  const existingGroup = await getExistingGroupById(groupId);

  if (!existingGroup) {
    throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  }

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isAlreadyMember = existingGroup.members.some((member) =>
    member.userId.equals(userId)
  );

  if (isAlreadyMember) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already a member of this group"
    );
  }

  existingGroup.members.push({
    userId: existingUser._id,
    joinedAt: new Date(),
    role: "member",
  });

  await existingGroup.save();

  return existingGroup;
};

const leaveGroup = async (groupId: string, userId: string) => {
  const existingGroup = await getExistingGroupById(groupId);

  if (!existingGroup) {
    throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  }

  const isMember = existingGroup.members.some((member) =>
    member.userId.equals(userId)
  );

  if (!isMember) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not a member of this group"
    );
  }

  if (existingGroup.createdBy.equals(userId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Group creators cannot leave the group. You can delete the group instead."
    );
  }

  existingGroup.members = existingGroup.members.filter(
    (member) => !member.userId.equals(userId)
  );

  await existingGroup.save();

  return existingGroup;
};

const removeMember = async (
  groupId: string,
  userId: string,
  memberId: string
) => {
  const existingGroup = await getExistingGroupById(groupId);

  if (!existingGroup) {
    throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  }

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    !existingGroup.createdBy.equals(userId) &&
    existingUser.role !== "admin"
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the group creator or a system admin can remove members from the group"
    );
  }

  existingGroup.members = existingGroup.members.filter(
    (member) => !member.userId.equals(memberId)
  );

  await existingGroup.save();

  return existingGroup;
};

const getGroupMembers = async (groupId: string) => {
  const existingGroup = await getExistingGroupById(groupId);

  if (!existingGroup) {
    throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  }

  return existingGroup.members;
};

export const GroupService = {
  getGroupById,
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  removeMember,
  getGroupMembers,
};
