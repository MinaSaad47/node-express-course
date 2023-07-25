const path = require("path");

const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

module.exports = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("please provide an image");
  }

  const image = req.files.image;
  if (!image.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("the uploaded file is not an image");
  }

  const imagePath = path.join(__dirname, `../public/uploads/${image.name}`);
  await image.mv(imagePath);

  res.status(StatusCodes.OK).json({
    image: {
      src: `uploads/${image.name}`,
    },
  });
};
