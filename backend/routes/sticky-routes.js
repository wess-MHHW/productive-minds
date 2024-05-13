const express = require("express");
const authController = require("./../controllers/authentication-controller");
const stickyController = require("./../controllers/sticky-controller");

const router = express.Router();

router.route("/create").post(authController.protect, stickyController.create);

router.route("/get-all").get(authController.protect, stickyController.getAll);

router
  .route("/update/:id")
  .patch(authController.protect, stickyController.updateSticky);

router
  .route("/delete/:id")
  .delete(authController.protect, stickyController.deleteSticky);

router
  .route("/delete-all")
  .delete(authController.protect, stickyController.deleteAll);

module.exports = router;
