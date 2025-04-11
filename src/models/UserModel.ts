import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserModel = {
    findByEmail: async (email: string) => {
        return prisma.user.findUnique({ where: { email } });
    },
    updateResetToken: async (id: string, resetToken: string, expires: Date) => {
        return prisma.user.update({
            where: { id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: expires,
            },
        });
    },
    create: async (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) => {
        return prisma.user.create({ data });
    },
    findById: async (id: string) => {
        return prisma.user.findUnique({ where: { id } });
    },
    updateProfile: async (
        id: string,
        data: {
            firstName?: string;
            lastName?: string;
            password?: string;
            resetPasswordToken?: string | null;
            resetPasswordExpires?: Date | null;
        }
    ) => {
        return prisma.user.update({ where: { id }, data });
    },
    delete: async (id: string) => {
        return prisma.user.delete({ where: { id } });
    },
    findByResetToken: async (resetToken: string) => {
        return prisma.user.findFirst({
            where: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: {
                    gt: new Date(), // Ensure the token has not expired
                },
            },
        });
    },
};
