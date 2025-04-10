import express from "express";
import {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} from "../validations/Auth";
import { authLimiter } from "../middlewares/RateLimiter";
import { AuthService } from "../services/AuthService";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import cors from "cors";
import helmet from "helmet";

const router = express.Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.use(helmet());
router.use(cors());

// router.options("*", (_, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Content-Type, Authorization"
//     );
//     res.sendStatus(204);
// });

router.post(
    "/register",
    [authLimiter, ...registerValidation],
    authController.register
);
router.post("/login", [authLimiter, ...loginValidation], authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.put(
    "/me",
    authMiddleware,
    updateProfileValidation,
    authController.updateProfile
);
router.delete("/me", authMiddleware, authController.deleteAccount);
router.post("/logout", authMiddleware, authController.logout);
router.post(
    "/forgot-password",
    [authLimiter, ...forgotPasswordValidation],
    authController.forgotPassword
);
router.post(
    "/reset-password",
    [authLimiter, ...resetPasswordValidation],
    authController.resetPassword
);

export default router;
