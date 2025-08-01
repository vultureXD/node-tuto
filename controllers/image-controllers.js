const Image = require("../models/Image");
const { upload } = require("../helpers/cloudinaryHelper");
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

module.exports = {
    uploadImage,
};
