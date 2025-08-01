const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload.middleware");
const { uploadImage } = require("../controllers/image-controllers");

const router = express.Router();

//upload to image
router.post(
    "/upload",
    authMiddleware,
    adminMiddleware,
    uploadMiddleware.single("image"),
    uploadImage
);

//get all the image
 
module.exports = router;
