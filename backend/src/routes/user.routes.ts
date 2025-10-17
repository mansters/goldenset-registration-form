import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

router.post("/check-email", userController.checkEmail);
router.post("/register", userController.registerUser);

export default router;
