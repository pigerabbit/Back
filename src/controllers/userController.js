import { userService } from "../services/userService";
import { User } from "../db";
import generateRandomPassword from "../utils/generate-random-password";
import is from "@sindresorhus/is";
import bcrypt from "bcrypt";

const userController = {
  changeProfileImg: async (req, res, next) => {
    try {
      const userId = req.params.id;

      if (userId !== req.currentUserId) {
        throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
      }

      const toUpdate = { imageLink: req.file.location };
      const updatedUser = await userService.setUser({
        userId,
        toUpdate,
      });
      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  defaultProfileImage: async (req, res, next) => {
    try {
      const userId = req.params.id;
      if (userId != req.currentUserId) {
        throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
      }
      const user = await userService.getUserInfo({ userId });
      if (user.errorMessage) {
        throw new Error(user.errorMessage);
      }
      const toUpdate = {};
      toUpdate.imageLink = process.env.initial_image;

      // } else if (user.type === "naver") {
      //   toUpdate.imageLink = process.env.initial_naver;
      // } else if (user.type === "kakao") {
      //   toUpdate.imageLink = process.env.initial_kakao;
      // } else {
      //   toUpdate.imageLink = process.env.initial_google;
      // }

      const updatedUser = await userService.setUser({
        userId,
        toUpdate,
      });
      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // req (request) 에서 데이터 가져오기
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const address = req.body.address;
      const phoneNumber = req.body.phoneNumber;
      const type = "sogongx2";

      // 위 데이터를 유저 db에 추가하기
      const newUser = await userService.addUser({
        name,
        email,
        password,
        address,
        phoneNumber,
        type,
      });

      if (newUser.errorMessage) {
        throw new Error(newUser.errorMessage);
      }

      const body = {
        success: true,
        payload: newUser,
      };

      res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      // req (request) 에서 데이터 가져오기
      const email = req.body.email;
      const password = req.body.password;
      // 소공소공을 통한 가입 회원에 한해서만 로그인서비스 제공,다른 타입은 자동로그인 구현
      const type = "sogongx2";

      // 위 데이터를 이용하여 유저 db에서 유저 찾기
      const user = await userService.getUser({ email, password, type });

      if (user.errorMessage) {
        throw new Error(user.errorMessage);
      }

      const body = {
        success: true,
        payload: user,
      };

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  getUserList: async (req, res, next) => {
    try {
      // 전체 사용자 목록을 얻음
      const users = await userService.getUsers();

      const body = {
        success: true,
        payload: users,
      };
      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const userId = req.currentUserId;
      const currentUserInfo = await userService.getUserInfo({
        userId,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      let alertsExist = await User.getAlertList({ userId });
      alertsExist = alertsExist[0]?.alertList.length > 0 ? true : false;

      const body = {
        success: true,
        payload: currentUserInfo,
      };
      
      res.json(body);
    } catch (error) {
      next(error);
    }
  },

  editUser: async (req, res, next) => {
    try {
      // URI로부터 사용자 id를 추출함.
      const userId = req.params.id;
      // body data 로부터 업데이트할 사용자 정보를 추출함.
      if (userId != req.currentUserId) {
        throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
      }
      //name,desciption,weight,height,gender만 변경가능하고 비밀번호는 다른 라우터를 사용
      const name = req.body.name ?? null;
      const address = req.body.address ?? null;
      const phoneNumber = req.body.phoneNumber ?? null;
      const distance = req.body.distance ?? null;
      const businessName = req.body.businessName ?? null;
      const businessLocation = req.body.businessLocation ?? null;

      const toUpdate = { name, address, phoneNumber, distance };

      // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
      const updatedUser = await userService.setUser({
        userId,
        toUpdate,
        businessName,
        businessLocation,
      });

      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedUser,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const userInfo = await userService.getUserInfo({ userId });

      if (userInfo.errorMessage) {
        throw new Error(userInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: userInfo,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const userId = req.params.id;
      // body data 로부터 업데이트할 사용자 정보를 추출함.
      if (userId != req.currentUserId) {
        throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
      }
      const currentPassword = req.body.currentPassword;

      const checkPassword = await userService.checkPassword({
        userId,
        password: currentPassword,
      });

      if (checkPassword.errorMessage) {
        throw new Error(checkPassword.errorMessage);
      }

      const newPassword = req.body.newPassword;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const toUpdate = { password: hashedPassword };

      const updatedUser = await userService.setUser({
        userId,
        toUpdate,
      });
      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      const body = {
        success: true,
        payload: "비밀번호가 변경되었습니다.",
      };
      res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const email = req.params.email;
      const phoneNumber = req.body.phoneNumber;

      const user = await User.findByEmail({ email });
      if (!user) {
        throw new Error("해당 메일로 가입된 사용자가 없습니다.");
      }

      if (phoneNumber !== user.phoneNumber) {
        throw new Error("전화번호가 일치하지 않습니다.");
      }

      const userId = user.id;
      const name = user.name;
      //8개 무작위 숫자 string
      const newPassword = generateRandomPassword();

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const toUpdate = { password: hashedPassword };
      const updatedUser = await userService.setUser({ userId, toUpdate });

      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      await userService.nodeMailer({ email, name, password: newPassword });

      const body = {
        success: true,
        payload: "임시 비밀번호가 전송되었습니다.",
      };

      res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const password = req.body.password;
      if (userId != req.currentUserId) {
        throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
      }

      const checkPassword = await userService.checkPassword({
        userId,
        password,
      });

      if (checkPassword.errorMessage) {
        throw new Error(checkPassword.errorMessage);
      }

      const deletedUser = await userService.deleteUser({
        userId,
      });

      if (deletedUser.errorMessage) {
        throw new Error(deletedUser.errorMessage);
      }

      const body = {
        success: true,
        payload: "회원탈퇴를 완료하였습니다.",
      };

      res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  checkName: async (req, res, next) => {
    try {
      const name = req.params.name;
      const user = await User.findByName({ name });
      let result = "none exists";
      if (user) {
        result = "already exists";
      }

      const body = {
        success: true,
        payload: result,
      };
      res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  voteBadUser: async (req, res, next) => {
    try {
      // currentId로 바꿀 예정
      const userId = req.currentUserId;
      const badId = req.params.badId;

      const toUpdate = { userId };
      const updatedBadIdInfo = await userService.setReportedBy({
        badId,
        toUpdate,
      });

      if (updatedBadIdInfo.errorMessage) {
        throw new Error(updatedBadIdInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedBadIdInfo,
      };

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  countReport: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const countReport = await userService.getCountReport({ userId });

      const body = {
        success: true,
        payload: countReport,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },
};

export { userController };
