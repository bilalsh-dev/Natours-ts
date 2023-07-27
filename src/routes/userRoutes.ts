import express, { Router } from 'express';
import * as userController from './../controllers/userController';

const userRouter: Router = express.Router();

userRouter.route('/').get(userController.getAllUsers).post(userController.createUser);

userRouter.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default userRouter;
