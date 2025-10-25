import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../type/common";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { metaService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    console.log(user);
    const result = await metaService.fetchDashboardMetaData(
      user as IJWTPayload
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Dashboard meta data fetch  successfully",
      data: result,
    });
  }
);

export const metaController = { fetchDashboardMetaData };
