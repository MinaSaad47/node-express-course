const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.error("[ERROR] ", err);
  const customeError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong try again later",
  };
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  if (err.name === "ValidationError") {
    customeError.statusCode = StatusCodes.BAD_REQUEST;
    customeError.msg = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }
  if (err.name === "CastError") {
    customeError.statusCode = StatusCodes.NOT_FOUND;
    customeError.msg = `no item found for id ${err.value}`;
  }
  if (err.code && err.code === 11000) {
    customeError.statusCode = StatusCodes.BAD_REQUEST;
    customeError.msg = `duplicate value entered for ${Object.keys(
      err.keyValue
    )} fields, please choose other values`;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customeError.statusCode).json({ msg: customeError.msg });
};

module.exports = errorHandlerMiddleware;
