const cloudinary = require("../config/cloudinary");

const upload = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error("error while uploading", error);
        throw error; // hatayı yukarı atmak da iyi olur
    }
};

module.exports = { upload };
