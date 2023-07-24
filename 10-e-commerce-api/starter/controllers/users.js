const { StatusCodes } = require("http-status-codes");

const CustomeError = require("../errors");
const utils = require("../utils");
const User = require("../models/User");

module.exports.getAll = async (req, res) => {
  const users = await User.find({ role: "user" });
  console.log(req.user);
  res.status(StatusCodes.OK).json({ users });
};

module.exports.getOne = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new CustomeError.NotFoundError("user not found");
  }

  await utils.permissions.check(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

module.exports.getCurrent = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

module.exports.updateOne = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new CustomeError.BadRequestError("please provide an email and name");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { email, name },
    { new: true, runValidators: true }
  );

  const tokenUser = utils.token.create(user);

  await utils.jwt.attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomeError.BadRequestError(
      "please provide current and new passwords"
    );
  }

  const user = await User.findById(req.user.id);

  if (!(await user.comparePassword(oldPassword))) {
    throw new CustomeError.UnauthenticatedError("invalid credentials");
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "updated password successfully" });
};
