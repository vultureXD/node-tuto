const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload.middleware");
const {
    uploadImage,
    fetchImagesController,
    deleteImageController,
} = require("../controllers/image-controllers");

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

//delete
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);
router.get("/get", authMiddleware, fetchImagesController);
module.exports = router;


//    "publicId": "qa8lgziwkyqyxrvl4ue2",
//         "uploadedBy": "688ce3529230f62a75a9e614",
//         "_id": "688ce3a49230f62a75a9e618",
//         "createdAt": "2025-08-01T15:56:20.069Z",
//         "updatedAt": "2025-08-01T15:56:20.069Z",
//         "__v": 0