import { Router } from "express";
import { metaController } from "./meta.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  metaController.fetchDashboardMetaData
);

export const metaRoute = router;
