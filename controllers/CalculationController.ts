import { Request, Response } from "express";
import { CalculationService } from "../services/CalculationService";
import {
  CalculationResult,
  ErrorResponse,
  CalculationHistory,
  SuccessMessage,
} from "../types";

class CalculationController {

  constructor(private calculationService: CalculationService) {

    this.calculate = this.calculate.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
  }

  async calculate(req: Request, res: Response<CalculationResult | ErrorResponse>) {
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

  async getHistory(req: Request, res: Response<CalculationHistory | ErrorResponse>) {
    const userId = req.userId;
    try {
      const history = await this.calculationService.getHistory(userId);
      res.json({ history });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async clearHistory(req: Request, res: Response<SuccessMessage | ErrorResponse>) {
    const userId = req.userId;
    try {
      await this.calculationService.clearHistory(userId);
      res.json({ message: "History cleared" });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }
}

export { CalculationController };