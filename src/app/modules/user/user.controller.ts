import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);
  console.log(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, searchTerm } = req?.query;
  const result = await userService.getAllFromDb({
    page: Number(page),
    limit: Number(limit),
    searchTerm,
  });
  console.log(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

export const userController = {
  createPatient,
  getAllFromDb,
};
