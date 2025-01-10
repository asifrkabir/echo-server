export const USER_ROLE_LIST = ["admin", "user"];

export const USER_ROLE_ENUM = {
  admin: "admin",
  user: "user",
} as const;

export const userSearchableFields = ["name", "email", "role"];
