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
const updateDoctorInfoDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await doctorService.updateDoctorInfoDb(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor Updated successfully",

    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.softDelete(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

const getAiSuggestions = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.getAiSuggestions(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "AI suggestion fetched successfully",
    data: result,
  });
});
export const doctorController = {
  getAllFromDb,
  updateDoctorInfoDb,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
  getAiSuggestions,
};
