import { Router } from "express";
import { oauthController } from "../controllers/oauthController";
import { oauthService } from "../services/oauthService";

const oauthRouter = Router();

oauthRouter.post("/oauth/login", oauthController.login);

oauthRouter.get("/users/login/kakao", async (req, res, next) => {
  try {
    const code = req.query.code;

    const user = await oauthService.upsertKakaoUser({ code });

    // const redirect_uri = `http://localhost:3000/login/kakao?token=${user.token}`;
    // 배포용으로 수정
    const redirect_uri = `http://localhost:3000/login/kakao?token=${user.token}`;
    res.status(200).redirect(redirect_uri);
  } catch (err) {
    next(err);
  }
});

export { oauthRouter };
