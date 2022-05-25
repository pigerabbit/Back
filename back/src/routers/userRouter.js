import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { userService } from "../services/userService";
import generateRandomPassword from "../utils/generate-random-password";
import { User } from "../db";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.post("/users", async function (req, res, next) {
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
    const business = req.body.business;
    const type = "sogongx2";

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      name,
      email,
      password,
      address,
      business,
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
});

userRouter.post("/user/login", async function (req, res, next) {
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
});

userRouter.get("/userlist", login_required, async function (req, res, next) {
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
});

userRouter.get(
  "/user/current",
  login_required,
  async function (req, res, next) {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const user_id = req.currentUserId;
      const currentUserInfo = await userService.getUserInfo({
        user_id,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: currentUserInfo,
      };
      res.json(body);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.put("/users/:id", login_required, async function (req, res, next) {
  try {
    // URI로부터 사용자 id를 추출함.
    const user_id = req.params.id;
    // body data 로부터 업데이트할 사용자 정보를 추출함.
    if (user_id != req.currentUserId) {
      throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
    }
    //name,desciption,weight,height,gender만 변경가능하고 비밀번호는 다른 라우터를 사용
    const name = req.body.name ?? null;
    const address = req.body.address ?? null;
    const business = req.body.business ?? null;
    const location = req.body.location ?? null;
    const distance = req.body.distance ?? null;

    const toUpdate = { name, address, business, location, distance };

    // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
    const updatedUser = await userService.setUser({ user_id, toUpdate });

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
});

userRouter.get("/users/:id", login_required, async function (req, res, next) {
  try {
    const user_id = req.params.id;
    const userInfo = await userService.getUserInfo({ user_id });

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
});

userRouter.put(
  "/users/:id/changePassword",
  login_required,
  async function (req, res, next) {
    try {
      const user_id = req.params.id;
      // body data 로부터 업데이트할 사용자 정보를 추출함.
      if (user_id != req.currentUserId) {
        throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
      }
      const currentPassword = req.body.currentPassword;

      const checkPassword = await userService.checkPassword({
        user_id,
        password: currentPassword,
      });

      if (checkPassword.errorMessage) {
        throw new Error(checkPassword.errorMessage);
      }

      const newPassword = req.body.newPassword;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const toUpdate = { password: hashedPassword };

      const updatedUser = await userService.setUser({
        user_id,
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
  }
);

userRouter.post(
  "/users/:id/resetPassword",
  login_required,
  async function (req, res, next) {
    try {
      const user_id = req.params.id;
      if (user_id != req.currentUserId) {
        throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
      }
      //추후 service단으로 빠질 예정입니다.
      const user = await User.findById({ user_id });

      if (!user) {
        throw new Error("해당 메일로 가입된 사용자가 없습니다.");
      }

      const name = user.name;
      const email = user.email;
      //8개 무작위 숫자 string
      const newPassword = generateRandomPassword();
      console.log(newPassword);
      //   console.log(newPassword);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const toUpdate = { password: hashedPassword };
      const updatedUser = await userService.setUser({ user_id, toUpdate });

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
  }
);

userRouter.delete(
  "/users/:id",
  login_required,
  async function (req, res, next) {
    try {
      const user_id = req.params.id;
      const password = req.body.password;
      if (user_id != req.currentUserId) {
        throw new Error("다른 소유자의 소유물을 변경할 권한이 없습니다.");
      }

      const checkPassword = await userService.checkPassword({
        user_id,
        password,
      });

      if (checkPassword.errorMessage) {
        throw new Error(checkPassword.errorMessage);
      }

      const deletedUser = await userService.deleteUser({
        user_id,
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
  }
);

userRouter.get("/users/checkName/:name", async function (req, res, next) {
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
});

export { userRouter };
