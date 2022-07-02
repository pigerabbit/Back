import { User } from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getRequiredInfoFromData } from "../utils/user";
import { toggleService } from "../services/toggleService";
import { addressToXY } from "../utils/addressToXY.js";
import axios from "axios";

class oauthService {
  static async addUser({ email, nickname }) {
    // 기본 프로필
    const imageLink = process.env.initial_image;

    // id 는 유니크 값 부여
    const id = crypto.randomUUID();

    // Date.now()를 활용해 임시 비밀번호 생성
    const uuid = String(Date.now());

    const password = uuid;

    let name = nickname + "_" + uuid;

    // 비밀번호 해쉬화
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = id;
    const newToggle = await toggleService.addToggle({
      userId,
    });

    if (newToggle.errorMessage) {
      throw new Error(newToggle.errorMessage);
    }

    // 임시주소: 서울특별시 강남구 테헤란로53길
    const address = "서울 강남구 선릉로 433 (역삼동, 세방빌딩) 16층 엘리스";
    const coordinates = await addressToXY(address);

    const newUser = {
      id,
      name,
      email,
      password: hashedPassword,
      address,
      phoneNumber: "00000000000",
      type: "oauth",
      imageLink,
      locationXY: {
        type: "Point",
        coordinates: coordinates,
      },
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

  static async getUser({ email }) {
    // 이메일 db에 존재 여부 확인
    const user = await User.findByEmail({ email });
    if (!user) {
      const errorMessage =
        "해당 계정은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    if (user.deleted === true) {
      const errorMessage = "해당 계정은 이미 탈퇴하였습니다.";
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

  static async upsertKakaoUser({ code }) {
    const KAKAO_CLIENT_id = process.env.KAKAO_ID;
    const KAKAO_REDIRECT_URL = process.env.KAKAO_REDIRECT_URL_IN_SERVICE;

    //카카오 토큰 받기
    const ret = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_CLIENT_id}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`
    );

    const kakaoToken = ret.data.access_token;

    //카카오 유저정보 받기
    const kakaoData = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: { Authorization: `Bearer ${kakaoToken}` },
    });

    // kakao oauth 로그인 시 email 값 대신에 고유값(id)를 넣어줌
    let email = kakaoData.data.id;
    const nickname = kakaoData.data.properties.nickname;

    let user = await User.findByEmail({ email });

    // 가입여부 확인. 가입된 정보 없는 경우 회원가입
    if (!user) {
      user = await oauthService.addUser({ email, nickname });
    }

    // 토큰을 가져오기 위해 회원 정보 불러오기

    const userInfo = await oauthService.getUser({ email });

    if (userInfo.errorMessage) {
      throw new Error(userInfo.errorMessage);
    }

    const token = userInfo.token;

    return { token };
  }
}

export { oauthService };
