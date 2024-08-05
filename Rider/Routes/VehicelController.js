const express = require('express');
const { body } = require('express-validator');
const VehicleController = require('../controllers/VehicleController');

const router = express.Router();

// Validation rules
const vehicleValidationRules = [
    body('VehicleName').isString().isLength({ min: 1 }).withMessage('VehicleName is required'),
    body('VehicleNumber').isString().isLength({ min: 1 }).withMessage('VehicleNumber is required'),
    body('VehicleModelNumber').optional().isString(),
    body('VehicleType').optional().isString(),
    body('WheelType').optional().isString(),
    body('VehicleSeat').optional().isInt().withMessage('VehicleSeat must be an integer'),
    body('RefUser').optional().isInt().withMessage('RefUser must be an integer'),
    body('IsActive').optional().isBoolean().withMessage('IsActive must be a boolean')
];

// Create a new vehicle with validation
router.post('/', vehicleValidationRules, VehicleController.CreateVehicle);

// Read all vehicles
router.get('/', VehicleController.GetAllVehicles);

// Update a vehicle by VehicleId with validation
router.put('/:VehicleId', vehicleValidationRules, VehicleController.UpdateVehicle);

// Delete a vehicle by VehicleId
router.delete('/:VehicleId', VehicleController.DeleteVehicle);

module.exports = router;
