import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request } from "express";


const JWT_SECRET = process.env.JWT_SECRET as string;

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = (input: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(input, hashed);
};

export const generateJWT = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJWT = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};

export const getToken = (req: Request): string | undefined => {
  return req.headers.authorization?.split(" ")[1];
};
