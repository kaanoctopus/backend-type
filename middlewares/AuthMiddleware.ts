import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../controllers/responseController";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        sendResponse(res, 401, "Unauthorized");
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        req.userId = decoded.id;
        next();
    } catch {
        sendResponse(res, 401, "Invalid Token");
        return;
    }
    sendResponse(res, 200, "Token is valid");
};
