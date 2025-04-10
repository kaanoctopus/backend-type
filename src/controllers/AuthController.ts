import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { AuthResponse, LoginResponse, ErrorResponse, SafeUser } from "../types";

export class AuthController {
    constructor(private authService: AuthService) {}

    forgotPassword = async (
        req: Request,
        res: Response<AuthResponse | ErrorResponse>
    ) => {
        try {
            const { email } = req.body;
            const result = await this.authService.forgotPassword(email);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    resetPassword = async (
        req: Request,
        res: Response<AuthResponse | ErrorResponse>
    ) => {
        try {
            const { token, newPassword } = req.body;
            const result = await this.authService.resetPassword(
                token,
                newPassword
            );
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    register = async (
        req: Request,
        res: Response<AuthResponse | ErrorResponse>
    ) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            const result = await this.authService.register(
                firstName,
                lastName,
                email,
                password
            );
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    login = async (
        req: Request,
        res: Response<LoginResponse | ErrorResponse>
    ) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    getMe = async (req: Request, res: Response<SafeUser | ErrorResponse>) => {
        try {
            const user = await this.authService.getMe(req.userId);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    updateProfile = async (
        req: Request,
        res: Response<AuthResponse | ErrorResponse>
    ) => {
        try {
            const { firstName, lastName } = req.body;
            const result = await this.authService.updateProfile(
                req.userId,
                firstName,
                lastName
            );
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    deleteAccount = async (
        req: Request,
        res: Response<AuthResponse | ErrorResponse>
    ) => {
        try {
            const result = await this.authService.deleteAccount(req.userId);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };

    logout = (res: Response<AuthResponse>) => {
        res.json({ message: "Logged out" });
    };
}
