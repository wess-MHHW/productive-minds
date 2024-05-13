const express = require("express");
const userController = require("./../controllers/user-controller");
const authController = require("./../controllers/authentication-controller");

const router = express.Router();

router.route("/get").get(authController.protect, userController.getUser);

router
  .route("/update")
  .patch(authController.protect, userController.updateUser);

router.post(
  "/categories/add",
  authController.protect,
  userController.addCategory
);
router.delete(
  "/categories/delete",
  authController.protect,
  userController.deleteCategory
);
router.patch(
  "/categories/update-all",
  authController.protect,
  userController.updateCategories
);

router.delete(
  "/categories/delete-all",
  authController.protect,
  userController.deleteCategories
);

router.post("/tags/add", authController.protect, userController.addTag);
router.delete("/tags/delete", authController.protect, userController.deleteTag);
router.patch(
  "/tags/update-all",
  authController.protect,
  userController.updateTags
);
router.delete(
  "/tags/delete-all",
  authController.protect,
  userController.deleteTags
);

router
  .route("/delete")
  .delete(authController.protect, userController.deleteUser);

module.exports = router;
