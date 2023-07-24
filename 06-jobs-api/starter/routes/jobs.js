const express = require("express");
const controller = require("../controllers/jobs");

const authenticationMiddleware = require("../middleware/authentication");

const router = express.Router();

router.use(authenticationMiddleware);
router.route("/").post(controller.createJob).get(controller.getAllJobs);
router
  .route("/:id")
  .patch(controller.updateJob)
  .get(controller.getJob)
  .delete(controller.deleteJob);

module.exports = router;
