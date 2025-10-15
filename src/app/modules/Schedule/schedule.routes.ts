import { Router } from "express";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.get("/", scheduleController.schedulesForDoctor);
router.post("/", scheduleController.insertIntoDB);
router.delete("/:id", scheduleController.deleteScheduleFromDb);

export const scheduleRoutes = router;
