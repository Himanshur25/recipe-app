import { Router } from "express";
import { authController } from "../controllers/auth";
import { checkUserForAuthentication } from "../middlewares/auth";
import { upload } from "../multer";

const router = Router();

// Registration and login routes

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/users", checkUserForAuthentication, authController.getAllUsers);

export const authRoute = router;
