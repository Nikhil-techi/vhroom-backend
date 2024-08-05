const express = require("express");
const { body } = require("express-validator");
const DocumentController = require("../Controller/DriverDocController");
const multer = require("multer");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Validation rules
const documentValidationRules = [
  body("DocNumber").isString().withMessage("Doc Number is required"),
  body("IssueDate")
    .isISO8601()
    .toDate()
    .withMessage("IssueDate must be a valid date"),
  body("ExpiredDate")
    .optional()
    .isISO8601()
    .withMessage("ExpiredDate must be a valid date"),
  body("DocType")
    .optional()
    .isString()
    .withMessage("DocType must be a valid Document Type"),
  body("RefUser").optional().isInt().withMessage("RefUser must be an integer"),
  body("IsActive")
    .optional()
    .isBoolean()
    .withMessage("IsActive must be a boolean"),
];

// Create a new document with validation
router.post(
  "/Add",
  documentValidationRules,
  upload.single("file"),
  DocumentController.AddAndUpdateDocument
);

router.get(
  "/GetDocument/:Id/:DocType",
  DocumentController.GetUploadedDocumentById
);

module.exports = router;
