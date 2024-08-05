const express = require('express');
const BannerController = require('../Controller/BannerController');

const multer = require("multer");

const router = express.Router();

const upload = multer();

// Create a new address with validation
router.get('/GetAllBanner/:Name', BannerController.GetAllBanner);
router.post('/AddBanner',upload.single('banner'), BannerController.AddBanner);
router.get('/GetAppVersion/:Name', BannerController.GetAppVersion);

module.exports = router;
