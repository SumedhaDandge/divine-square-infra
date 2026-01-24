import { body, param } from "express-validator";







export const createProjectValidator = [
  body("projectName")
    .notEmpty()
    .withMessage("Project name is required"),

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("projectType")
    .isIn(["commercial", "residential", "both"])
    .withMessage("Invalid project type"),

  body("totalUnits")
    .isInt({ min: 1 })
    .withMessage("Total units must be greater than 0"),

  body("priceRange.min")
    .isNumeric()
    .withMessage("Minimum price is required"),
    body("projectStage")
  .optional()
  .isIn(["upcoming", "ongoing", "completed"])
  .withMessage("Invalid project stage"),


 
];

export const updateProjectValidator = [
  param("id").isMongoId(),

  body("projectType")
    .optional()
    .isIn(["commercial", "residential", "mixed-use"]),

  body("totalUnits").optional().isInt({ min: 1 }),
  body("priceRange.min").optional().isNumeric(),
  body("nearbyDevelopments").optional().isArray(),
  body("amenities").optional().isArray(),
  body("projectImages").optional().isArray(),
  body("projectStage")
  .optional()
  .isIn(["upcoming", "ongoing", "completed"]),

];
