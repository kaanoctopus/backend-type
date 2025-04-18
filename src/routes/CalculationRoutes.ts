import express from "express";
import { CalculationService } from "../services/CalculationService";
import { CalculationController } from "../controllers/CalculationController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { calcLimiter } from "../middlewares/RateLimiter";
import { validateCalculation } from "../validations/Calculate";
import { handleValidation } from "../middlewares/HandleValidation";

const router = express.Router();

const calculationService = new CalculationService();
const calculationController = new CalculationController(calculationService);

router.post(
    "/calculate",
    calcLimiter, // Apply calcLimiter only to the calculate route
    authMiddleware,
    validateCalculation,
    handleValidation,
    calculationController.calculate
);
router.get("/history", authMiddleware, calculationController.getHistory);
router.delete("/history", authMiddleware, calculationController.clearHistory);

export default router;
