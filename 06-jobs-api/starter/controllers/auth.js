const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");

module.exports.register = async (req, res) => {
  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  return res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide an email and a password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("invalid credentials");
  }

  if (!(await user.comparePasswords(password))) {
    throw new UnauthenticatedError("invalid credentials");
  }
  const token = user.createJWT();

  return res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
