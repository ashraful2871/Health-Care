import { Router } from "express";
import { patientController } from "./patien.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", patientController.getAllFromDB);

router.get("/:id", patientController.getByIdFromDB);

router.patch("/", auth(UserRole.PATIENT), patientController.updateIntoDb);

router.delete("/soft/:id", patientController.softDelete);

export const patientRoutes = router;
