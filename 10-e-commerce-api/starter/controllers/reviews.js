const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");
const Product = require("../models/Product");
const Review = require("../models/Review");
const utils = require("../utils");

module.exports.getAll = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports.getOne = async (req, res) => {
  const review = await Review.findById(req.params.id).populate({
    path: "product",
    select: "name company price",
  });
  if (!review) {
    throw new CustomError.NotFoundError(
      `not found review with id ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ review });
};

module.exports.createOne = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findById(productId);
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`no product with id ${productId}`);
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.id,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError("review already submitted");
  }
  req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

module.exports.deleteOne = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new CustomError.NotFoundError(
      `not found review with id ${req.params.id}`
    );
  }
  await utils.permissions.check(req.user, review.user);
  await review.delete();
  res.status(StatusCodes.OK).json({ msg: "removed review successfully" });
};

module.exports.updateOne = async (req, res) => {
  const { rating, title, comment } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new CustomError.NotFoundError(
      `not found review with id ${req.params.id}`
    );
  }
  await utils.permissions.check(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
