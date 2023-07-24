const CustomError = require("../errors");
const utils = require("../utils");

module.exports.user = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Failed");
  }

  try {
    const { id, name, role } = await utils.jwt.verify({ token });
    req.user = { id, name, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Failed");
  }
};

module.exports.permissions = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "unauthorized to access this route"
      );
    }
    next();
  };
};
