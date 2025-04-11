import { evaluate } from "mathjs";
import { CalculationModel } from "../models/CalculationModel";
import { CalculationResult, CalculationRecord } from "../types";
import { saveToBackupAPI } from "../utils/saveBackup";

class CalculationService {
    /**
     * Evaluates a mathematical expression and saves the result to the database.
     * If saving to the primary database fails, it attempts to save to a backup API.
     * @param expression - The mathematical expression to evaluate.
     * @param userId - The ID of the user performing the calculation.
     * @returns The result of the evaluated expression.
     * @throws Error if the expression is invalid or an error occurs during evaluation.
     */
    async evaluateExpression(
        expression: string,
        userId: string
    ): Promise<CalculationResult> {
        try {
            const result = evaluate(expression).toString();

            // Save the calculation asynchronously, logging any errors that occur.
            this.saveCalculationAsync(userId, expression, result).catch((err) =>
                console.error("Background save error:", err)
            );

            return { result };
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.";
            throw new Error(
                `Invalid Expression or Calculation Error: ${errorMessage}`
            );
        }
    }

    /**
     * Saves a calculation to the database. If the primary save fails, it attempts to save to a backup API.
     * @param userId - The ID of the user performing the calculation.
     * @param expression - The mathematical expression that was evaluated.
     * @param result - The result of the evaluated expression.
     * @returns The saved calculation record or void if saved to the backup API.
     */
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

    /**
     * Retrieves the calculation history for a specific user.
     * @param userId - The ID of the user whose history is being retrieved.
     * @returns An array of calculation records.
     */
    async getHistory(userId: string): Promise<CalculationRecord[]> {
        return CalculationModel.findHistoryByUserId(userId);
    }

    /**
     * Clears the calculation history for a specific user.
     * @param userId - The ID of the user whose history is being cleared.
     */
    async clearHistory(userId: string): Promise<void> {
        await CalculationModel.clearHistoryByUserId(userId);
    }
}

export { CalculationService };
