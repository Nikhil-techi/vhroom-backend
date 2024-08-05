const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const UserController = require("../Controller/UserController");
const JWTAuthToken = require("../../services/JWTAuthToken");

// Validation rules
const userValidationRules = [
  body("Name")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .notEmpty(),
  body("Mobile")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Mobile is required")
    .notEmpty(),
  body("Email").isEmail().withMessage("Email is required").notEmpty(),
  body("Photo").optional().isURL().withMessage("Photo must be a valid URL"),
  body("IsVerified").optional().isBoolean().default(false),
  body("ServiceType").optional().isString(),
  body("Gender")
    .isString()
    .isIn(["Male", "Female", "Other"])
    .notEmpty()
    .withMessage("Gender must be 'Male', 'Female' or 'Other'"),
  body("DOB")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("DOB must be a valid date in the format YYYY-MM-DD")
    .notEmpty(),
];

// Create a new user with validation
router.post(
  "/AddAndUpdateUser",
  JWTAuthToken,
  userValidationRules,
  UserController.AddAndUpdateUser
);
router.get("/GetUserById/:Id", JWTAuthToken, UserController.GetUserById);
router.post("/GenerateOTP", UserController.GenerateOtp);
router.post("/VerifyOTP", UserController.VerifyOTP);

module.exports = router;
