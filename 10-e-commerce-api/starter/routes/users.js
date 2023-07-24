const express = require("express");

const controller = require("../controllers");
const middleware = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(
    middleware.auth.user,
    middleware.auth.permissions("admin"),
    controller.users.getAll
  );

router
  .route("/updatePassword")
  .patch(middleware.auth.user, controller.users.updatePassword);

router
  .route("/updateUser")
  .patch(middleware.auth.user, controller.users.updateOne);

router.route("/showMe").get(middleware.auth.user, controller.users.getCurrent);

router.route("/:id").get(middleware.auth.user, controller.users.getOne);

module.exports = router;
