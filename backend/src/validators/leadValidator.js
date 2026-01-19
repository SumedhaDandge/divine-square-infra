import { body, param } from "express-validator";

export const createLeadValidator = [
  body("customerName").notEmpty().withMessage("Customer name is required"),
  body("mobile").notEmpty().withMessage("Mobile number is required"),
  body("leadSource").notEmpty().withMessage("Lead source is required"),
  body("lookingFor")
    .isIn(["Residential", "Commercial"])
    .withMessage("Invalid lookingFor value"),
  body("propertyType")
    .isIn(["Plot", "Flat", "Shop", "Office"])
    .withMessage("Invalid property type"),
  body("purpose")
    .isIn(["Self Use", "Investment", "Rental"])
    .withMessage("Invalid purpose"),
];

export const updateLeadValidator = [
  param("id").isMongoId().withMessage("Invalid lead id"),
];
