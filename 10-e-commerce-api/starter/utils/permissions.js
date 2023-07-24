const CustomeError = require("../errors");

module.exports.check = (requestUser, resourceUserId) => {
  if (requestUser.role == "admin") return;

  if (requestUser.id !== resourceUserId.toString()) {
    throw new CustomeError.UnauthorizedError(
      "unauthorized to access this route"
    );
  }
};
