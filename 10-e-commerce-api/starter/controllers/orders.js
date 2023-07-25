const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");
const Product = require("../models/Product");
const Order = require("../models/Order");
const utils = require("../utils");

module.exports.createOne = async (req, res) => {
  const { items, tax, shippingFee } = req.body;
  if (!items || items.length < 1) {
    throw new CustomError.BadRequestError("no item provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("please provide tax and shippingFee");
  }
  let orderItems = [];
  let subtotal = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new CustomError.NotFoundError(`no product with id ${item.product}`);
    }
    const { name, price, image, _id } = product;
    const orderItem = {
      amount: item.amount,
      name,
      price,
      product: _id,
      image,
    };
    orderItems = [...orderItems, orderItem];
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;
  const paymentIntent = {
    amount: total,
    client_secret: "someSecret",
  };
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.id,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

module.exports.getAll = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

module.exports.showAllOfMine = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

module.exports.getOne = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new CustomError.NotFoundError(`no order with id ${req.params.id}`);
  }
  await utils.permissions.check(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

module.exports.updateOne = async (req, res) => {
  const { paymentIntentId } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new CustomError.NotFoundError(`no order with id ${req.params.id}`);
  }
  await utils.permissions.check(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports.deleteOne = async (req, res) => {};
