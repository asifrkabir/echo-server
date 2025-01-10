import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isPasswordValid = async (
  userInputPassword: string,
  userPasswordFromDB: string
) => {
  return await bcrypt.compare(userInputPassword, userPasswordFromDB);
};

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
