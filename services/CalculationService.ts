import { evaluate } from "mathjs";
import { PrismaClient } from "@prisma/client";
import {
  CalculationResult,
  CalculationRecord,
} from "../types";

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

      try {
        const response = await fetch(
          "https://calcbackend.netlify.app/api/calculate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.AUTH_KEY}`,
            },
            body: JSON.stringify({ userId, expression, result }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Backup API responded with status: ${response.status}`
          );
        }

        console.log("Successfully saved to secondary API.");
      } catch (backupErr) {
        console.error("Backup API save failed:", backupErr);
      }
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