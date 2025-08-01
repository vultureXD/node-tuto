const Image = require("../models/Image");
const { upload } = require("../helpers/cloudinaryHelper");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadImage = async (req, res) => {
    try {
        //check if file  is misssing in request object

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "file is required please upload an image",
            });
        }

        //upload to cloudniary
        const { url, publicId } = await upload(req.file.path);

        //store image url and public id along with uploaded user id in database
        const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId,
        });
        await newImage.save();
        //delete the file from localstroage
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: "image uploaded successfully",
            image: newImage,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "something went wrong please try again",
        });
    }
};

const fetchImagesController = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObject = {};
        sortObject[sortBy] = sortOrder;

        const images = await Image.find()
            .sort(sortObject)
            .skip(skip)
            .limit(limit);

        if (images) {
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "something went wrong please try again",
        });
    }
};
const deleteImageController = async (req, res) => {
    try {
        const getImageId = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getImageId);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "image not ofund",
            });
        }

        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "you are not authorized to delete this image",
            });
        }

        //delete the image first froum your cloudinary storage

        await cloudinary.uploader.destroy(image.publicId);

        //delete image from mongodb
        await Image.findByIdAndDelete(getImageId);

        res.status(200).json({
            success: true,
            message: "image deleted seuccedsfuly",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "something went wrong please try again",
        });
    }
};
module.exports = {
    uploadImage,
    fetchImagesController,
    deleteImageController,
};
