import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.PATIENT), reviewController.insertToDb);

export const reviewRoutes = router;
