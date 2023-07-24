const CustomAPIError = require("../error/custom-api-error");

module.exports = (err, req, res, next) => {
  console.error("[ERROR] ", req.method, req.url);
  if (err instanceof CustomAPIError) {
    return res.status(err.status).json({ msg: err.message });
  }
  return res.status(500).json({ msg: err });
};
