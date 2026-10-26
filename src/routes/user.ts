import { protect ,allowedFor} from "../controllers/auth_controller.js";
import * as userController from "../controllers/user_controller.js";
import * as userValidator from "../utils/validators/user_validator.js"
import { Router } from "express";

const userRouter = Router();

userRouter.post("/api/v1/users",protect, allowedFor("admin"),userController.uploaduserImage, ...userValidator.createUser, userController.resizeImage, userController.createUser);
userRouter.get("/api/v1/users",protect,allowedFor("manager", "admin"), userController.getUsers);
userRouter.get("/api/v1/users/me",protect,userController.getMe);
userRouter.get("/api/v1/users/:id",protect, allowedFor("admin"),userValidator.getUser, userController.getUser);
userRouter.patch("/api/v1/users/me/changePassword",protect,userValidator.changeMyPassword, userController.changeMyPassword)
userRouter.patch("/api/v1/users/me/updateMe",protect, userController.uploaduserImage,...userValidator.updateLoggedUser,userController.resizeImage,userController.updateMe)
userRouter.patch("/api/v1/users/:id",protect,allowedFor("admin"), userController.uploaduserImage, ...userValidator.updateUser, userController.resizeImage, userController.updateUser);
userRouter.patch("/api/v1/users/:id/changePassword",protect,allowedFor("admin"), userValidator.changeUserPassword,userController.changeUserPassword)
userRouter.delete("/api/v1/users/deleteMe", protect, userController.deleteMe)
userRouter.delete("/api/v1/users/:id",protect, allowedFor("admin"),userValidator.deleteUser, userController.deleteUser);

export default userRouter;