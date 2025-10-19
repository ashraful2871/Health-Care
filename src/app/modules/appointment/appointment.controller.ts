import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import sendResponse from "../../shared/sendResponse";
import { appointmentService } from "./appointment.service";
import { IJWTPayload } from "../../type/common";

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
