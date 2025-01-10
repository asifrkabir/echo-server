import { Types } from "mongoose";

export type TPayment = {
  user: Types.ObjectId;
  post: Types.ObjectId;
  amount: number;
  status: "successful" | "failed";
};
