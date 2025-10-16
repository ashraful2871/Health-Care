import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/", doctorController.getAllFromDb);

export const doctorRoutes = router;
