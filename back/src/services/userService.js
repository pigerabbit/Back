import { User } from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendMail from "../utils/send-mail";
import { getRequiredInfoFromData } from "../utils/user";
import { UserModel } from "../db/schemas/user";

class userService {
  static async addUser({
    id,
    name,
    email,
    password,
    address,
    type,
  }) {
    //일반회원가입일때
    if (type === "sogongx2") {
      const emailExits = await User.isEmailExists({ email, type });
      //일반회원중에서 이메일이 존재하는지 체크
      if (emailExits) {
        const errorMessage =
          "이 이메일은 현재 가입이력이 있는 이메일입니다. 다른 이메일을 이용해주세요.";
        return { errorMessage };
      }
    }

    // 기본 프로필
    const imageLink = process.env.initial_image;

    // 비밀번호 해쉬화
    const hashedPassword = await bcrypt.hash(password, 10);

    // id 는 유니크 값 부여
    if (!id) {
      id = crypto.randomUUID();
    }
    const newUser = {
      id,
      name,
      email,
      password: hashedPassword,
      address,
      type,
      imageLink,
    };
    //소셜로그인시 회원가입이 자동으로될때 없는 성분이 있기때문에 없는 성분들을 삭제
    Object.keys(newUser).forEach((key) => {
      if (newUser[key] === undefined) {
        delete newUser[key];
      }
    });

    // db에 저장
    const createdNewUser = await User.create({ newUser });
    const resultUser = getRequiredInfoFromData(createdNewUser);

    return resultUser;
  }

  static async getUser({ email, password, type }) {
    // 이메일 db에 존재 여부 확인
    const user = await User.findByEmail({ email, type });
    if (!user) {
      const errorMessage =
        "해당 계정은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    if (user.deleted === true) {
      const errorMessage = "해당 계정은 이미 탈퇴하였습니다.";
      return { errorMessage };
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      const errorMessage =
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ userId: user.id }, secretKey);

    // 반환할 loginuser 객체를 위한 변수 설정
    const loginUser = getRequiredInfoFromData(user);
    loginUser.token = token;

    return loginUser;
  }

  static async getUsers() {
    const users = await User.findAll();
    return users;
  }

  static async getUserInfo({ userId }) {
    const user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage =
        "해당 유저는 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    if (user.deleted === true) {
      const errorMessage = "해당 계정은 이미 탈퇴하였습니다.";
      return { errorMessage };
    }
    const resultUser = getRequiredInfoFromData(user);
    return resultUser;
  }

  static async setUser({ userId, toUpdate }) {
    // 우선 해당 id 의 유저가 db에 존재하는지 여부 확인
    let user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage = "가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    if (user.deleted === true) {
      const errorMessage = "해당 계정은 이미 탈퇴하였습니다.";
      return { errorMessage };
    }
    Object.keys(toUpdate).forEach((key) => {
      if (toUpdate[key] === undefined || toUpdate[key] === null) {
        delete toUpdate[key];
      }
    });

    const updatedUser = await User.updateAll({ userId, setter: toUpdate });
    const resultUser = getRequiredInfoFromData(updatedUser);
    return resultUser;
  }

  static async getUserInfo({ userId }) {
    const user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage =
        "해당 유저는 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    if (user.deleted === true) {
      const errorMessage = "해당 계정은 이미 탈퇴하였습니다.";
      return { errorMessage };
    }
    const resultUser = getRequiredInfoFromData(user);
    return resultUser;
  }

  static async checkPassword({ userId, password }) {
    const user = await User.findById({ userId });
    if (!user) {
      const errorMessage =
        "해당 유저는 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    if (user.deleted === true) {
      const errorMessage = "해당 계정은 이미 탈퇴하였습니다.";
      return { errorMessage };
    }
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      const errorMessage = "비밀번호를 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return true;
  }

  static async nodeMailer({ email, name, password }) {
    const message = sendMail(
      email,
      "소공소공 임시 비밀번호입니다.",
      `안녕하세요 ${name}님, 임시 비밀번호는: ${password} 입니다. 로그인 후 비밀번호를 꼭 변경해주세요!`
    );

    return message;
  }

  static async setReportedBy({ badId, toUpdate }) {
    let badIdInfo = await User.findById({ userId: badId });

    if (!badIdInfo) {
      const errorMessage =
        "정보가 없습니다. badId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let reportedByInfo = badIdInfo.reportedBy;
    let newValue = {};

    const index = reportedByInfo.findIndex((f) => f === toUpdate.userId);

    if (index > -1) {
      reportedByInfo.splice(index, 1);
    } else {
      reportedByInfo.push(toUpdate.userId);
    }
    newValue = reportedByInfo;
    const updatedReportedByInfo = await UserModel.findOneAndUpdate(
      { id: badId },
      { $set: { reportedBy: newValue } },
      { returnOriginal: false }
    );

    return updatedReportedByInfo;
  }

  static async getCountReport({ userId }) {
    const userInfo = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!userInfo) {
      const errorMessage =
        "해당 유저는 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const ReportPeople = userInfo.reportedBy;
    const countReport = ReportPeople.length;
    return countReport;
  }

  static async deleteUser({ userId }) {
    const user = await User.findById({ userId });
    console.log("user:", user);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user || user === null) {
      const errorMessage = "해당 유저가 존재하지 않습니다.";
      return { errorMessage };
    }
    if (user.deleted === true) {
      const errorMessage = "해당 계정은 이미 탈퇴하였습니다.";
      return { errorMessage };
    }
    const setter = { deleted: true };
    const deletedUser = await User.updateAll({ userId, setter });

    return deletedUser;
  }
 
  static async getAlertList({ currentUserId, userId }) { 
    if (currentUserId !== userId) { 
      const errorMessage = "본인의 알림만 볼 수 있습니다."
      return { errorMessage };
    }

    const user = await User.findById({ userId });
    if (!user || user === null) {
      const errorMessage = "해당 유저가 존재하지 않습니다.";
      return { errorMessage };
    }

    if (user.deleted === true) {
      const errorMessage = "해당 계정은 이미 탈퇴하였습니다.";
      return { errorMessage };
    }

    const alertList = await User.getAlertList({ userId });
    return alertList;
  }
}

export { userService };
