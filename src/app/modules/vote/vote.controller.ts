import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VoteService } from "./vote.service";

const processVote = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await VoteService.processVote(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vote processed successfully",
    data: result,
  });
});

export const VoteController = { processVote };
