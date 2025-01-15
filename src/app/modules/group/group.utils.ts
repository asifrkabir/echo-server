import { Group } from "./group.model";

export const getExistingGroupById = async (id: string) => {
  const result = await Group.findOne({ _id: id, isActive: true });

  return result;
};
