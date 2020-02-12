import { Router } from "express";
import { authController } from "../controllers/auth";

const authRouter: Router = Router();

authRouter.post("/github", authController.github);

export { authRouter };