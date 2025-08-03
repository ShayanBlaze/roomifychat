const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  res.status(200).json({ 
    message: "File uploaded successfully", 
    url: req.file.path 
  });
};

module.exports = { uploadImage };