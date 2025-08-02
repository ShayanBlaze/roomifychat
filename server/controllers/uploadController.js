const BadRequestError = require("../errors");

const uploadImage = (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }

  res
    .status(200)
    .json({ message: "File uploaded successfully", imageUrl: req.file.path });
};

module.exports = { uploadImage };
