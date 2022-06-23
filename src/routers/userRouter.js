import { Router } from "express";
import { login_required } from "../middlewares/login_required";

import { userController } from "../controllers/userController";

const { userImageUpload } = require("../utils/s3");

const userRouter = Router();

userRouter.put(
  "/users/:id/profileImage",
  login_required,
  userImageUpload.single("userImg"),
  userController.changeProfileImg
);

userRouter.put(
  "/users/:id/defaultProfileImage",
  login_required,
  userController.defaultProfileImage
);

userRouter.post("/users", userController.create);

userRouter.post("/users/login", userController.login);

userRouter.get("/users", login_required, userController.getUserList);

userRouter.get("/users/current", login_required, userController.getCurrentUser);

userRouter.put("/users/:id", login_required, userController.editUser);

userRouter.get("/users/:id", userController.getUser);

userRouter.put(
  "/users/:id/changePassword",
  login_required,
  userController.changePassword
);

userRouter.post(
  "/users/email/:email/resetPassword",
  login_required,
  userController.resetPassword
);

userRouter.delete("/users/:id", login_required, userController.deleteUser);

userRouter.get("/users/checkName/:name", userController.checkName);

userRouter.put(
  "/users/:badId/vote",
  login_required,
  userController.voteBadUser
);

userRouter.get(
  "/users/:id/countReport",
  login_required,
  userController.countReport
);

export { userRouter };
