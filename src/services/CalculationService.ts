import { evaluate } from "mathjs";
import { PrismaClient } from "@prisma/client";
import { CalculationResult, CalculationRecord } from "../types";
import { saveToBackupAPI } from "../utils/saveBackup";

const prisma = new PrismaClient();

class CalculationService {
    // Evaluate a mathematical expression and save the result to the database
    // If the primary database save fails, it will try to save to a backup API
    async evaluateExpression(
        expression: string,
        userId: string
    ): Promise<CalculationResult> {
        try {
            const result = evaluate(expression).toString();
            console.log("Result:", result);

            this.saveCalculationAsync(userId, expression, result).catch((err) =>
                console.error("Background save error:", err)
            );

            return { result };
        } catch (error) {
            throw new Error("Invalid Expression");
        }
    }
    // Save the calculation to the database and handle any errors
    private async saveCalculationAsync(
        userId: string,
        expression: string,
        result: string
    ): Promise<CalculationRecord | void> {
        try {
            const calculation = await prisma.calculation.create({
                data: {
                    userId,
                    expression,
                    result,
                },
            });

            return calculation;
        } catch (err) {
            console.error("Primary save failed. Trying secondary API...", err);
            await saveToBackupAPI(userId, expression, result);
        }
    }

    async getHistory(userId: string): Promise<CalculationRecord[]> {
        return prisma.calculation.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async clearHistory(userId: string): Promise<void> {
        await prisma.calculation.deleteMany({ where: { userId } });
    }
}

export { CalculationService };
