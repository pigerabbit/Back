import { Router } from "express";
import { userService } from "../services/userService";
import { User } from "../db";
import jwt from "jsonwebtoken";
import generateRandomPassword from "../utils/generate-random-password";
import {
  getInfoFromKakao,
  getInfoFromNaver,
  getInfoFromGoogle,
} from "../utils/authEmail";
import { getRequiredInfoFromData } from "../utils/user";
const querystring = require("querystring");
const qs = require("qs");
const fetch = require("node-fetch");

var google = require("googleapis").google;
var oauth2Client = new google.auth.OAuth2();

const oauthRouter = Router();

class Kakao {
  constructor(code) {
    this.url = "https://kauth.kakao.com/oauth/token";
    this.clientId = process.env.KAKAO_ID;
    this.clientSecret = process.env.KAKAO_SecretCode;
    this.redirectUri = process.env.KakaoRedirectUrl;
    this.code = code;
    this.userInfoUri = "https://kapi.kakao.com/v2/user/me";
  }
}

class Naver {
  constructor(code) {
    this.url = "https://nid.naver.com/oauth2.0/token";
    this.clientId = process.env.NAVER_ID;
    this.clientSecret = process.env.NAVER_SercretCode;
    this.redirectUri = process.env.NaverRedirectUrl;
    this.code = code;
    this.userInfoUri = "https://openapi.naver.com/v1/nid/me";
  }
}

class Google {
  constructor(code) {
    this.url = "https://www.googleapis.com/oauth2/v4/token";
    this.clientId = process.env.GOOGLE_ID;
    this.clientSecret = process.env.GOOGLE_SercretCode;
    this.redirectUri = process.env.GoogleRedirectUrl;
    this.code = code;
    this.userInfoUri = "https://www.googleapis.com/oauth2/v1/tokeninfo";
  }
}
const getAccessToken = async (options) => {
  try {
    return await fetch(options.url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: qs.stringify({
        grant_type: "authorization_code",
        client_id: options.clientId,
        client_secret: options.clientSecret,
        redirect_uri: options.redirectUri,
        code: options.code,
      }),
    }).then((res) => res.json());
  } catch (e) {
    next(e);
  }
};
const getUserInfo = async (url, access_token) => {
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => res.json());
  } catch (e) {
    next(e);
  }
};
const getOption = (coperation, code) => {
  switch (coperation) {
    case "kakao":
      return new Kakao(code);
      break;
    case "google":
      return new Google(code);
      break;
    case "naver":
      return new Naver(code);
      break;
  }
};

oauthRouter.get("/oauth/:coperation", async (req, res, next) => {
  try {
    const coperation = req.params.coperation;
    let code = req.param("code");
    if (code[code.length - 1] === "/") {
      code = code.slice(0, -1);
    }
    // console.log(code);
    const options = getOption(coperation, code);
    const token = await getAccessToken(options);
    // console.log(token);

    let userInfo;
    if (coperation === "google") {
      oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
        prompt: "consent",
        state: "GOOGLE_LOGIN",
      });
      oauth2Client.setCredentials({ access_token: token.access_token });
      var oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });
      userInfo = await oauth2.userinfo.get();
    } else {
      userInfo = await getUserInfo(options.userInfoUri, token.access_token);
    }

    // console.log("asd: ", userInfo);

    let result;
    // console.log(userInfo);
    if (coperation === "kakao") {
      result = getInfoFromKakao(userInfo);
    } else if (coperation === "naver") {
      result = getInfoFromNaver(userInfo);
    } else {
      result = getInfoFromGoogle(userInfo);
    }
    const user = await User.findById({
      user_id: result.id,
    });
    if (user) {
      if (user.deleted === true) {
        throw new Error("해당 소셜계정은 이미 회원탈퇴하셨습니다.");
      }
      const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
      const token = jwt.sign({ user_id: result.id }, secretKey);

      //   console.log(user);

      //   console.log(querystring.parse(query));
      const resultUser = getRequiredInfoFromData(user);
      resultUser.token = token;
      res.json(resultUser);
    } else {
      const password = generateRandomPassword();
      result.password = password;
      result.type = coperation;
      const createdUser = await userService.addUser(result);

      const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
      const token = jwt.sign({ user_id: result.id }, secretKey);
      createdUser.token = token;
      //   console.log(querystring.parse(query));
      const resultUser = getRequiredInfoFromData(createdUser);
      resultUser.token = token;
      res.json(resultUser);
    }
  } catch (error) {
    next(error);
  }
});

export { oauthRouter };
