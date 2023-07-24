const express = require("express");
const controller = require("../controllers/auth");

const router = express.Router();

router.route("/login").post(controller.login);
router.route("/register").post(controller.register);

module.exports = router;
