import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { parseBody } from "../../middlewares/bodyParser";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import validateRequest from "../../middlewares/validateRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { UserController } from "../user/user.controller";
import { UserValidations } from "../user/user.validation";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  multerUpload.fields([{ name: "itemImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(UserValidations.createUserValidationSchema),
  UserController.createUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/change-password",
  auth(USER_ROLE_ENUM.user, USER_ROLE_ENUM.admin),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthController.refreshToken
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPasswordValidationSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
