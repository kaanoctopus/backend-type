import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CalculationModel = {
    create: async (data: {
        userId: string;
        expression: string;
        result: string;
    }) => {
        return prisma.calculation.create({ data });
    },
    findHistoryByUserId: async (userId: string) => {
        return prisma.calculation.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },
    clearHistoryByUserId: async (userId: string) => {
        return prisma.calculation.deleteMany({ where: { userId } });
    },
};
