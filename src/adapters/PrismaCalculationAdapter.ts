import { PrismaClient } from "@prisma/client";
import { ICalculationAdapter } from "./interfaces/ICalculationAdapter";

export class PrismaCalculationAdapter implements ICalculationAdapter {
    private prisma = new PrismaClient();

    async create(data: { userId: string; expression: string; result: string }) {
        return this.prisma.calculation.create({ data });
    }

    async findHistoryByUserId(userId: string) {
        return this.prisma.calculation.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async clearHistoryByUserId(userId: string) {
        return this.prisma.calculation.deleteMany({ where: { userId } });
    }
}
