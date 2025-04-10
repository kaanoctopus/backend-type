import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { AuthResponse, LoginResponse, SafeUser } from "../types";
import {
    hashPassword,
    comparePasswords,
    generateJWT,
} from "../utils/authUtils";
import { sendEmail } from "../utils/mailer";

const prisma = new PrismaClient();

export class AuthService {
    async forgotPassword(email: string): Promise<AuthResponse> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("User not found");

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires,
            },
        });

        const resetUrl = `https://calculatoroctopus.netlify.app/?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
Please click on the following link, or paste this into your browser to complete the process:\n\n
${resetUrl}\n\n
If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        });

        return { message: "Password reset email sent" };
    }

    async resetPassword(
        token: string,
        newPassword: string
    ): Promise<AuthResponse> {
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() },
            },
        });

        if (!user)
            throw new Error("Password reset token is invalid or has expired");

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        return { message: "Password has been reset" };
    }

    async register(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ): Promise<AuthResponse> {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new Error("User already exists");

        const hashedPassword = await hashPassword(password);

        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });

        return { message: "User registered successfully" };
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await comparePasswords(password, user.password))) {
            throw new Error("Invalid credentials");
        }

        const token = generateJWT(user.id);
        const {
            password: _,
            resetPasswordToken,
            resetPasswordExpires,
            ...safeUser
        } = user;

        return {
            token,
            user: safeUser,
        };
    }

    // method to fetch the current user's details
    async getMe(userId: string): Promise<SafeUser> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });

        if (!user) throw new Error("User not found");
        return user;
    }

    async updateProfile(
        userId: string,
        firstName: string,
        lastName: string
    ): Promise<AuthResponse> {
        await prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName },
        });

        return { message: "Profile updated" };
    }

    async deleteAccount(userId: string): Promise<AuthResponse> {
        await prisma.user.delete({ where: { id: userId } });
        return { message: "Account deleted" };
    }
}
