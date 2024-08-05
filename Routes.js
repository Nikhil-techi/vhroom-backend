const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const LocationRoutes = require("./common/Routes/LocationRoutes");
const BannerRoutes = require("./common/Routes/BannerRoutes");
const UserRoutes = require("./Rider/Routes/UserRoutes");
const DocRoutes = require("./Rider/Routes/DriverDocRoutes");


router.use("/", LocationRoutes);
router.use("/User", UserRoutes);
router.use("/Doc", DocRoutes);
router.use("/Banner", BannerRoutes);




// Services
const AddS3Media = require("./services/AddS3Media")
router.use("/AddS3Media",upload.single("file"), AddS3Media);


module.exports = router;
