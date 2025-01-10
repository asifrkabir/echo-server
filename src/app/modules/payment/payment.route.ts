import { Router } from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";

const router = Router();

router.post(
  "/create-payment-intent",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PaymentController.createPaymentIntent
);

router.get("/", auth(USER_ROLE_ENUM.admin), PaymentController.getAllPayments);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PaymentController.createPayment
);

export const PaymentRoutes = router;
