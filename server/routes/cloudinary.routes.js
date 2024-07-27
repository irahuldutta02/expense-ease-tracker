const express = require("express");
const cloudinaryRoutes = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_FOLDER,
} = require("../config/server.config");
const { protect } = require("../middleware/auth.middleware");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function handleUpload(file, folder, publicId, resourceType) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: resourceType,
    folder: folder,
    public_id: publicId,
    use_filename: true,
    unique_filename: false,
  });
  return res;
}

cloudinaryRoutes.post(
  "/upload",
  protect,
  upload.single("my_file"),
  async (req, res) => {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Extract the file extension and determine resource type
      const fileExtension = path.extname(req.file.originalname);
      const fileName = path.basename(req.file.originalname, fileExtension);
      const publicId = `${fileName}-${Date.now()}${fileExtension}`;
      const resourceType = req.file.mimetype.startsWith("image")
        ? "image"
        : "raw";

      const cldRes = await handleUpload(
        dataURI,
        CLOUDINARY_FOLDER,
        publicId,
        resourceType
      );

      const response = {
        asset_folder: CLOUDINARY_FOLDER,
        asset_id: cldRes.asset_id,
        bytes: cldRes.bytes,
        created_at: cldRes.created_at,
        display_name: fileName,
        etag: cldRes.etag,
        original_filename: fileName,
        placeholder: cldRes.placeholder,
        public_id: cldRes.public_id,
        resource_type: cldRes.resource_type,
        secure_url: cldRes.secure_url,
        signature: cldRes.signature,
        tags: cldRes.tags,
        type: cldRes.type,
        url: cldRes.url,
        version: cldRes.version,
        version_id: cldRes.version_id,
      };

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: error.message,
      });
    }
  }
);

module.exports = cloudinaryRoutes;
