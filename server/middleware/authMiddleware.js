const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
