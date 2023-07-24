const express = require("express");

const controller = require("../controllers");
const middleware = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(controller.reviews.getAll)
  .post(middleware.auth.user, controller.reviews.createOne);

router
  .route("/:id")
  .get(controller.reviews.getOne)
  .patch(middleware.auth.user, controller.reviews.updateOne)
  .delete(middleware.auth.user, controller.reviews.deleteOne);

module.exports = router;
