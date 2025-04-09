import { Request, Response, NextFunction  } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
    req: Request,
    res: any,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        const errorResponse = { message: "Unauthorized" };
        return res.status(401).json(errorResponse);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        req.userId = decoded.id;
        next();
    } catch {
        const errorResponse = { message: "Invalid Token" };
        return res.status(401).json(errorResponse);
    }
};
