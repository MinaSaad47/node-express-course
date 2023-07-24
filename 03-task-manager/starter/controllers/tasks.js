const express = require("express");

const Task = require("../models/tasks");
const asyncWrapper = require("../middlewares/async-wrapper");
const CustomAPIError = require("../error/custom-api-error");

module.exports.createOne = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).send({ task });
});

module.exports.readAll = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  return res.status(200).send({ tasks });
});

module.exports.readOne = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const task = await Task.findOne({ _id: id });
  if (!task) {
    return next(new CustomAPIError(`task not found with id: ${id}`, 404));
  }
  return res.status(200).send({ task });
});

module.exports.updateOne = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOneAndUpdate({ _id: id }, req.body, {
    overwrite: true,
    runValidators: true,
    returnDocument: "after",
  });
  return res.status(200).json({ task });
});

module.exports.deleteOne = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOneAndRemove({ _id: id });
  if (!task) {
    return next(new CustomAPIError(`task not found with id: ${id}`, 404));
  }
  return res.status(200).send({ task });
});
