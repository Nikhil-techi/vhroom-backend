const express = require('express');
const router = express.Router();
const LocationController = require('../Controller/LocationController');

router.get('/Country', LocationController.getAllCountries);
router.get('/State', LocationController.getAllStates);
router.get('/City', LocationController.getAllCities);

module.exports = router;
