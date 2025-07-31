const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const getDashboardData = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
    },
  });
};

module.exports = { getDashboardData };
