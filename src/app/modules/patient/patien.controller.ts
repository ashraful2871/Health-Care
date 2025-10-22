import { Request, Response } from "express";
import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import { patientFilterableFields } from "./patient.constant";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../shared/sendResponse";
import { patientService } from "./paitent.service";
import { IJWTPayload } from "../../type/common";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await patientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient retrieval successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.softDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient soft deleted successfully",
    data: result,
  });
});
const updateIntoDb = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await patientService.updateIntoDb(
      user as IJWTPayload,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient Updated  successfully",
      data: result,
    });
  }
);
export const patientController = {
  getAllFromDB,
  getByIdFromDB,
  softDelete,
  updateIntoDb,
};
