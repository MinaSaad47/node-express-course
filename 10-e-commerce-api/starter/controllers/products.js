const { StatusCodes } = require("http-status-codes");
const path = require("path");

const Product = require("../models/Product");
const CustomError = require("../errors");
const Review = require("../models/Review");

module.exports.getAll = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

module.exports.getOne = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new CustomError.NotFoundError(
      `not found product with id ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

module.exports.createOne = async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

module.exports.deleteOne = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new CustomError.NotFoundError(
      `not found product with id ${req.params.id}`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "deleted product successfully" });
};

module.exports.updateOne = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(
      `not found product with id ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

module.exports.uploadImage = async (req, res) => {
  const files = req.files;
  if (!files) {
    throw new CustomError.BadRequestError("please upload image");
  }
  const image = files.image;
  if (!image.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("please upload a valid image");
  }
  if (image.size > 2 * 1024 * 1024) {
    throw new CustomError.BadRequestError(
      "please upload image smaller than 2M"
    );
  }
  const filePath = path.join(__dirname, "../public/uploads", image.name);
  await image.mv(filePath);
  res.status(StatusCodes.OK).json({ image: `uploads/${image.name}` });
};

module.exports.getReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
