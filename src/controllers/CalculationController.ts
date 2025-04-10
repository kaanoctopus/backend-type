import { Request, Response } from "express";
import { CalculationService } from "../services/CalculationService";
import {
    CalculationResult,
    ErrorResponse,
    CalculationHistory,
    SuccessMessage,
} from "../types";

export class CalculationController {
    constructor(private calculationService: CalculationService) {}

    calculate = async (
        req: Request,
        res: Response<CalculationResult | ErrorResponse>
    ) =>{
        const { expression } = req.body;
        const userId = req.userId;

        try {
            const result = await this.calculationService.evaluateExpression(
                expression,
                userId
            );
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    getHistory = async (
        req: Request,
        res: Response<CalculationHistory | ErrorResponse>
    ) => {
        const userId = req.userId;
        try {
            const history = await this.calculationService.getHistory(userId);
            res.json({ history });
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    clearHistory = async(
        req: Request,
        res: Response<SuccessMessage | ErrorResponse>
    ) =>{
        const userId = req.userId;
        try {
            await this.calculationService.clearHistory(userId);
            res.json({ message: "History cleared" });
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}
