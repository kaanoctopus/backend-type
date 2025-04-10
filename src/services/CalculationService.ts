import { evaluate } from "mathjs";
import { PrismaClient } from "@prisma/client";
import { CalculationResult, CalculationRecord } from "../types";
import { saveToBackupAPI } from "../utils/saveBackup";

const prisma = new PrismaClient();

class CalculationService {
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
