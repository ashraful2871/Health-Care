import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../type/common";
import { prescriptionsService } from "./prescription.service";

const createPrescription = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await prescriptionsService.createAppointment(
      user as IJWTPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Prescription created Successfully",
      data: result,
    });
  }
);

export const prescriptionController = {
  createPrescription,
};
