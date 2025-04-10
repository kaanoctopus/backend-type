import { Response } from "express";

export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string
  ): Response => {
    return res.status(statusCode).json({ message });
  };