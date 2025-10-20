import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import sendResponse from "../../shared/sendResponse";

import { IJWTPayload } from "../../type/common";
import { appointmentService } from "./appointment.service";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await appointmentService.createAppointment(
      user as IJWTPayload,
      req.body
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Appointment create successfully",

      data: result,
    });
  }
);

export const appointmentController = {
  createAppointment,
};
