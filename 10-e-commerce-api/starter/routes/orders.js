const express = require("express");

const controller = require("../controllers");
const middleware = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(
    [middleware.auth.user, middleware.auth.permissions("admin")],
    controller.orders.getAll
  )
  .post(middleware.auth.user, controller.orders.createOne);

router
  .route("/showAllOfMine")
  .get(middleware.auth.user, controller.orders.showAllOfMine);

router
  .route("/:id")
  .get(middleware.auth.user, controller.orders.getOne)
  .patch(middleware.auth.user, controller.orders.updateOne)
  .delete(middleware.auth.user, controller.orders.deleteOne);

module.exports = router;
