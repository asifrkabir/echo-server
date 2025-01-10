import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { getExistingUserById } from "../modules/user/user.utils";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const authorization = req.headers.authorization;

    // const token = authorization?.split(" ")[1];
    const token = req.headers.authorization;

    // check if token was sent from client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    let decoded;

    // check if the token in valid
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (err) {
      // throwing error if some error is thrown during jwt.verify
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // check if role exists and if the role is authorized
    const { userId, role } = decoded;

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the user exists
    const existingUser = await getExistingUserById(userId);

    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
