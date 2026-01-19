import { body, param } from "express-validator";

export const createUserValidator = [
  body("name")
    .notEmpty().withMessage("Name is required"),

  body("mobile")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Valid Indian mobile number required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["admin", "staff", "sales"])
    .withMessage("Invalid role"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "blocked"])
    .withMessage("Invalid status")
];

export const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user id"),

  body("name").optional().notEmpty(),
  body("mobile").optional().matches(/^[6-9]\d{9}$/),
  body("email").optional().isEmail(),
  body("role").optional().isIn(["admin", "staff", "sales"]),
  body("status").optional().isIn(["active", "inactive", "blocked"])
];
