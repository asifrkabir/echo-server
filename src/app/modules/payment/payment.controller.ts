import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req, res) => {
  const { amount } = req.body;

  const result = await PaymentService.createPaymentIntent(amount);
  const clientSecret = {
    clientSecret: result.client_secret,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully",
    data: clientSecret,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPayments(req.query);

  if (result?.result?.length <= 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "No Data Found",
      meta: result.meta,
      data: result?.result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createPayment = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await PaymentService.createPayment(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
  getAllPayments,
  createPayment,
};
