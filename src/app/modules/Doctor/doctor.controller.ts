import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { doctorService } from "./doctor.service";
import pick from "../../helper/pick";
import { doctorFilterableFields } from "./doctor.constaint";

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, doctorFilterableFields);
  const result = await doctorService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});
export const doctorController = {
  getAllFromDb,
};
