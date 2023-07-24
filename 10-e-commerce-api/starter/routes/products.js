const express = require("express");

const controller = require("../controllers");
const middleware = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(controller.products.getAll)
  .post(
    [middleware.auth.user, middleware.auth.permissions("admin")],
    controller.products.createOne
  );

router
  .route("/:id")
  .get(controller.products.getOne)
  .patch(
    [middleware.auth.user, middleware.auth.permissions("admin")],
    controller.products.updateOne
  )
  .delete(
    [middleware.auth.user, middleware.auth.permissions("admin")],
    controller.products.deleteOne
  );

router.route("/:id/reviews").get(controller.products.getReviews);

router
  .route("/uploadImage")
  .post(
    [middleware.auth.user, middleware.auth.permissions("admin")],
    controller.products.uploadImage
  );

module.exports = router;
