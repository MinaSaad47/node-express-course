const express = require("express");

const controllers = require("../controllers");

const router = express.Router();

router.route("/login").post(controllers.auth.login);
router.route("/register").post(controllers.auth.register);
router.route("/logout").get(controllers.auth.logout);

module.exports = router;
