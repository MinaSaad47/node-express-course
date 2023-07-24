const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");
const Job = require("../models/Job");

module.exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

module.exports.createJob = async (req, res) => {
  const createdBy = req.user.id;
  const job = await Job.create({ createdBy, ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};

module.exports.getJob = async (req, res) => {
  const {
    user: { id: userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(
      `job with id: ${jobId} not found created by user: ${userId}`
    );
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports.updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { id: userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError(
      "please provide a valid company name and a position"
    );
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true }
  );
  res.status(StatusCodes.OK).json({ job });
};

module.exports.deleteJob = async (req, res) => {
  const id = req.params.id;
  await Job.findByIdAndDelete(id);
  res.status(StatusCodes.OK).send();
};
