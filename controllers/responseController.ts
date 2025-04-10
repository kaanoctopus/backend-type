import { Request, Response, NextFunction } from "express";
// import { validationResult } from "express-validator";

// export const handleValidationErrors = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(400).json({ message: "Validation failed", errors: errors.array() });
//     return;
//   }
//   next();
// };

export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string
  ): Response => {
    return res.status(statusCode).json({ message });
  };