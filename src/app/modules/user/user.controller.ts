import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);
  console.log(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "user create Successfully",
    data: result,
  });
});

export const userController = {
  createPatient,
};
