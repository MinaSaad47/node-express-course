const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const CustomError = require("../errors");
const utils = require("../utils");

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    throw new CustomError.UnauthenticatedError("invalid credentials");
  }

  const user = await User.findOne({ email });

  if (!user || !user.comparePassword(password)) {
    throw new CustomError.UnauthenticatedError("invalid credentials");
  }

  const tokenUser = utils.token.create(user);

  await utils.jwt.attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user });
};

module.exports.register = async (req, res) => {
  const { email, name, password } = req.body;
  if (await User.findOne({ email })) {
    throw new CustomError.BadRequestError("email already exists");
  }

  const role = (await User.countDocuments({})) === 0 ? "admin" : "user";

  const user = await User.create({ email, name, password, role });

  const tokenUser = utils.token.create(user);

  await utils.jwt.attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.CREATED).json({ user });
};

module.exports.logout = async (req, res) => {
  res.cookie("token", "random", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};
