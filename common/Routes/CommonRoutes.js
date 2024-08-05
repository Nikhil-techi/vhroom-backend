const express = require('express');
const { body } = require('express-validator');
const addressController = require('../controllers/addressController');

const router = express.Router();

// Validation rules
const addressValidationRules = [
    body('Name').isString().isLength({ min: 1 }).withMessage('Name is required'),
    body('City').isString().isLength({ min: 1 }).withMessage('City is required'),
    body('State').isString().isLength({ min: 1 }).withMessage('State is required'),
    body('Country').isString().isLength({ min: 1 }).withMessage('Country is required'),
    body('PinCode').isString().isLength({ min: 1 }).withMessage('PinCode is required'),
    body('RefUser').optional().isInt(),
    body('IsDefault').optional().isBoolean(),
    body('IsActive').optional().isBoolean()
];

// Create a new address with validation
router.post('/', addressValidationRules, addressController.createAddress);

// Read all addresses
router.get('/', addressController.getAllAddresses);

// Update an address by ID with validation
router.put('/:Id', addressValidationRules, addressController.updateAddress);

// Delete an address by ID
router.delete('/:Id', addressController.deleteAddress);

module.exports = router;
