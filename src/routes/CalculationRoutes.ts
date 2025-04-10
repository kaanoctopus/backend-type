import express from "express";
import { CalculationService } from "../services/CalculationService";
import { CalculationController } from "../controllers/CalculationController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { calcLimiter } from "../middlewares/RateLimiter";
import { validateCalculation } from "../validations/Calculate";

const router = express.Router();

const calculationService = new CalculationService();
const calculationController = new CalculationController(calculationService);

router.post(
    "/calculate",
    authMiddleware,
    validateCalculation,
    calcLimiter,
    calculationController.calculate
);
router.get("/history", authMiddleware, calculationController.getHistory);
router.delete("/history", authMiddleware, calculationController.clearHistory);

export default router;
