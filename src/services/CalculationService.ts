import { evaluate } from "mathjs";
import { CalculationModel } from "../models/CalculationModel";
import { CalculationResult, CalculationRecord } from "../types";
import { saveToBackupAPI } from "../utils/saveBackup";

class CalculationService {
    // Evaluate a mathematical expression and save the result to the database
    // If the primary database save fails, it will try to save to a backup API
    async evaluateExpression(
        expression: string,
        userId: string
    ): Promise<CalculationResult> {
        try {
            const result = evaluate(expression).toString();

            this.saveCalculationAsync(userId, expression, result).catch((err) =>
                console.error("Background save error:", err)
            );

            return { result };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(
                    "Invalid Expression or Calculation Error: " + error.message
                );
            }
            throw new Error(
                "Invalid Expression or Calculation Error: Unknown error occurred."
            );
        }
    }

    // Save the calculation to the database and handle any errors
    private async saveCalculationAsync(
        userId: string,
        expression: string,
        result: string
    ): Promise<CalculationRecord | void> {
        try {
            const calculation = await CalculationModel.create({
                userId,
                expression,
                result,
            });

            return calculation;
        } catch (err) {
            console.error("Primary save failed. Trying secondary API...", err);
            await saveToBackupAPI(userId, expression, result);
        }
    }

    async getHistory(userId: string): Promise<CalculationRecord[]> {
        return CalculationModel.findHistoryByUserId(userId);
    }

    async clearHistory(userId: string): Promise<void> {
        await CalculationModel.clearHistoryByUserId(userId);
    }
}

export { CalculationService };
