import { body } from "express-validator";
// import { handleValidationErrors } from "../controllers/errorController";
import { handleValidationErrors } from "../middlewares/HandleValidation";

export const registerValidation = [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    handleValidationErrors,
];

export const loginValidation = [
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidationErrors,
];

export const updateProfileValidation = [
    body("firstName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("First name cannot be empty"),
    body("lastName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Last name cannot be empty"),
    handleValidationErrors,
];

export const forgotPasswordValidation = [
    body("email").trim().isEmail().withMessage("Valid email is required"),
    handleValidationErrors,
];

export const resetPasswordValidation = [
    body("token").notEmpty().withMessage("Token is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    handleValidationErrors,
];
