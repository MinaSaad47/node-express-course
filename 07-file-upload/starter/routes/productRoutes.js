const express = require("express");

const controller = require("../controllers");

const router = express.Router();

router
  .route("/")
  .post(controller.products.createOne)
  .get(controller.products.getAll);

router.route("/uploads").post(controller.products.uploads);

module.exports = router;
