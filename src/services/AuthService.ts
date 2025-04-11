import crypto from "crypto";
import { UserModel } from "../models/UserModel";
import { AuthResponse, LoginResponse, SafeUser } from "../types";
import {
    hashPassword,
    comparePasswords,
    generateJWT,
} from "../utils/authUtils";
import { sendEmail } from "../utils/mailer";

export class AuthService {
    async forgotPassword(email: string): Promise<AuthResponse> {
        const user = await UserModel.findByEmail(email);
        if (!user) throw new Error("User not found");

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await UserModel.updateResetToken(
            user.id,
            resetToken,
            resetPasswordExpires
        );

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
        const user = await UserModel.findByResetToken(token);
        if (!user)
            throw new Error("Password reset token is invalid or has expired");

        const hashedPassword = await hashPassword(newPassword);

        await UserModel.updateProfile(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        return { message: "Password has been reset" };
    }

    async register(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ): Promise<AuthResponse> {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) throw new Error("User already exists");

        const hashedPassword = await hashPassword(password);

        await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        return { message: "User registered successfully" };
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const user = await UserModel.findByEmail(email);
        if (!user || !(await comparePasswords(password, user.password))) {
            throw new Error("Invalid credentials");
        }

        const token = generateJWT(user.id);
        const { ...safeUser } = user;

        return {
            token,
            user: safeUser,
        };
    }

    // method to fetch the current user's details
    async getMe(userId: string): Promise<SafeUser> {
        const user = await UserModel.findById(userId);
        if (!user) throw new Error("User not found");
        return user;
    }

    async updateProfile(
        userId: string,
        firstName: string,
        lastName: string
    ): Promise<AuthResponse> {
        await UserModel.updateProfile(userId, { firstName, lastName });

        return { message: "Profile updated" };
    }

    async deleteAccount(userId: string): Promise<AuthResponse> {
        await UserModel.delete(userId);
        return { message: "Account deleted" };
    }
}
