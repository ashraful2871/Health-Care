import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  const { accessToken, refreshToken, needPasswordChange } = result;

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Login Successfully",
    data: { needPasswordChange },
  });
});
const getMe = catchAsync(async (req: Request, res: Response) => {
  const userSession = req.cookies;
  const result = await authService.getMe(userSession);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Retrieve Successfully",
    data: result,
  });
});

export const authController = {
  login,
  getMe,
};
