import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { userController } from "../controllers/userController";

const { userImageUpload } = require("../utils/s3");
const userRouter = Router();

// 회원가입
userRouter.post(
  "/users",
  userController.create
);
  
// 로그인
userRouter.post(
  "/users/login", 
  userController.login
);
    
// 임시 비밀번호 발급
userRouter.post(
  "/users/email/:email/resetPassword",
  userController.resetPassword
);
  
// 모든 유저 정보 가져오기
userRouter.get(
  "/users", 
  login_required, 
  userController.getUserList
);

// 현재 유저 정보 가져오기
userRouter.get(
  "/users/current", 
  login_required, 
  userController.getCurrentUser
);

// 유저 정보 가져오기
userRouter.get(
  "/users/:id", 
  userController.getUser
);

// 아이디 중복 확인
userRouter.get(
  "/users/checkName/:name", 
  userController.checkName
);

// 신고당한 횟수 가져오기
userRouter.get(
  "/users/:id/countReport",
  login_required,
  userController.countReport
);

// 프로필 이미지 변경
userRouter.put(
  "/users/:id/profileImage",
  login_required,
  userImageUpload.single("userImg"),
  userController.changeProfileImg
);
    
// 기본 이미지로 변경
userRouter.put(
  "/users/:id/defaultProfileImage",
    login_required,
    userController.defaultProfileImage
);
        
// 유저 정보 수정
userRouter.put(
  "/users/:id", 
  login_required, 
  userController.editUser
);

// 비밀번호 변경
userRouter.put(
  "/users/:id/changePassword",
  login_required,
  userController.changePassword
);

// 악성 유저 신고
userRouter.put(
  "/users/:badId/vote",
  login_required,
  userController.voteBadUser
);

// 회원 탈퇴
userRouter.delete(
  "/users/:id", 
  login_required, 
  userController.deleteUser
);


export { userRouter };
