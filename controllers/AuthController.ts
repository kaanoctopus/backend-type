import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import {
  AuthResponse,
  LoginResponse,
  ErrorResponse,
  SafeUser
} from "../types";

export class AuthController {

  constructor(private authService: AuthService) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getMe = this.getMe.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.logout = this.logout.bind(this);
  }

  async forgotPassword(req: Request, res: Response<AuthResponse | ErrorResponse>) {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async resetPassword(req: Request, res: Response<AuthResponse | ErrorResponse>) {
    try {
      const { token, newPassword } = req.body;
      const result = await this.authService.resetPassword(token, newPassword);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async register(req: Request, res: Response<AuthResponse | ErrorResponse>) {
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
  }

  async login(req: Request, res: Response<LoginResponse | ErrorResponse>) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getMe(req: Request, res: Response<SafeUser | ErrorResponse>) {
    try {
      const user = await this.authService.getMe(req.userId);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateProfile(req: Request, res: Response<AuthResponse | ErrorResponse>) {
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
  }

  async deleteAccount(req: Request, res: Response<AuthResponse | ErrorResponse>) {
    try {
      const result = await this.authService.deleteAccount(req.userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  logout(req: Request, res: Response<AuthResponse>) {
    res.json({ message: "Logged out" });
  }
}