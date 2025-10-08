import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

const createPatient = catchAsync(
  (req: Request, res: Response, next: NextFunction) => {
    console.log("create patient", req.body);
  }
);

export const userController = {
  createPatient,
};
