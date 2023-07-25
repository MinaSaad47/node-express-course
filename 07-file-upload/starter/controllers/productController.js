const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");

module.exports.createOne = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

module.exports.getAll = async (_req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};
