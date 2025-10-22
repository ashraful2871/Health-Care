import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { reviewService } from "./review.service";
import { StatusCodes } from "http-status-codes";
import { IJWTPayload } from "../../type/common";

const insertToDb = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await reviewService.insertToDb(
      user as IJWTPayload,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

export const reviewController = {
  insertToDb,
};
