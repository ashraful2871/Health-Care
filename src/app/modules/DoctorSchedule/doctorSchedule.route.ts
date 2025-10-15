import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { createDoctorScheduleValidationZodSchema } from "./doctorSchedule.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(createDoctorScheduleValidationZodSchema),
  doctorScheduleController.insertIntoDB
);

export const doctorScheduleRoutes = router;
