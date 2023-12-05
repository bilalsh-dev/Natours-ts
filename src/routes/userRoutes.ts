import express, { Router } from "express";
import * as userController from "./../controllers/userController";
import * as authController from "./../controllers/authController";

const userRouter: Router = express.Router();

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;
