import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { AuthResponse, LoginResponse, SafeUser } from "../types";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

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

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_FROM,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
Please click on the following link, or paste this into your browser to complete the process:\n\n
${resetUrl}\n\n
If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
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

        const hashedPassword = await bcrypt.hash(newPassword, 10);

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

        const hashedPassword = await bcrypt.hash(password, 10);

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
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: "7d",
        });

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
