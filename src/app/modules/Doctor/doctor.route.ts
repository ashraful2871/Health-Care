import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/", doctorController.getAllFromDb);
router.post("/suggestion", doctorController.getAiSuggestions);
router.patch("/:id", doctorController.updateDoctorInfoDb);

export const doctorRoutes = router;
