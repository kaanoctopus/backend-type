import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../controllers/responseController";
import { getToken, verifyJWT } from "../utils/authUtils";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = getToken(req);

    if (!token) {
        sendResponse(res, 401, "Unauthorized");
        return;
    }

    try {
        const decoded = verifyJWT(token) as jwt.JwtPayload;
        req.userId = decoded.id;
        next();
    } catch {
        sendResponse(res, 401, "Invalid Token");
        return;
    }
};
