import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";
import { IJWTPayload } from "../../type/common";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;

    const result = await doctorScheduleService.insertIntoDB(
      user as IJWTPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Schedule Created successfully!",

      data: result,
    });
  }
);

export const doctorScheduleController = {
  insertIntoDB,
};
