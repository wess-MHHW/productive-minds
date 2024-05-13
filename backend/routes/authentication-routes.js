const express = require("express");
const authController = require("./../controllers/authentication-controller");

const router = express.Router();

router.route("/sign-up").post(authController.signp);

router.route("/log-in").post(authController.login);

router.route("/forgot-password").post(authController.forgotPassword);

router.route("/forgot-password/:token").get(authController.checkForgotPassword);

router.route("/reset-password/:token").patch(authController.resetPassword);

module.exports = router;
