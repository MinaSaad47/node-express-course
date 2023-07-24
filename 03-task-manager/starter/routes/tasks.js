const express = require("express");
const controller = require("../controllers/tasks");
const middlewares = {
  errorHandler: require("../middlewares/error-handler"),
};

const router = express.Router();

router.route("/").get(controller.readAll).post(controller.createOne);
router
  .route("/:id")
  .get(controller.readOne)
  .patch(controller.updateOne)
  .delete(controller.deleteOne);

// middlewares
router.use(middlewares.errorHandler);

module.exports = router;
