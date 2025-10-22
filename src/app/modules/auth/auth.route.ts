import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.login);
router.get("/me", authController.getMe);

export const authRoutes = router;
