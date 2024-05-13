const express = require("express");
const authController = require("./../controllers/authentication-controller");
const taskController = require("./../controllers/task-controller");

const router = express.Router();

router.route("/create").post(authController.protect, taskController.createTask);
router
  .route("/update/:id")
  .patch(authController.protect, taskController.updateTask);
router
  .route("/delete/:id")
  .delete(authController.protect, taskController.deleteTask);
router.route("/filter").get(authController.protect, taskController.filterTasks);

module.exports = router;
