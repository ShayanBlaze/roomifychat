const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "roomify_avatars",
    allowed_formats: ["jpeg", "png", "jpg"],
    transformation: [
      { width: 200, height: 200, crop: "fill", gravity: "face" },
    ],
  },
});

const chatImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "roomify_chat_images",
    allowed_formats: ["jpeg", "png", "jpg", "gif"],
  },
});

const uploadAvatar = multer({ storage: avatarStorage });
const uploadChatImage = multer({ storage: chatImageStorage });

module.exports = { uploadAvatar, uploadChatImage };
