import { PrismaClient } from "@prisma/client";
import { IUserAdapter } from "./interfaces/IUserAdapter";

export class PrismaUserAdapter implements IUserAdapter {
    private prisma = new PrismaClient();

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async updateResetToken(id: string, resetToken: string, expires: Date) {
        await this.prisma.user.update({
            where: { id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: expires,
            },
        });
        return true;
    }

    async create(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) {
        return this.prisma.user.create({ data });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async updateProfile(
        id: string,
        data: {
            firstName?: string;
            lastName?: string;
            password?: string;
            resetPasswordToken?: string | null;
            resetPasswordExpires?: Date | null;
        }
    ) {
        await this.prisma.user.update({ where: { id }, data });
        return true;
    }

    async delete(id: string) {
        await this.prisma.user.delete({ where: { id } });
        return true;
    }

    async findByResetToken(resetToken: string) {
        return this.prisma.user.findFirst({
            where: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
        });
    }
}
