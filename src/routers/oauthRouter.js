import { Router } from "express";
import { oauthController } from "../controllers/oauthController";
import { oauthService } from "../services/oauthService";

const oauthRouter = Router();

oauthRouter.post("/oauth/login", oauthController.login);

oauthRouter.get("/login/kakao", async (req, res, next) => {
  try {
    const code = req.query.code;

    const user = await oauthService.upsertKakaoUser({ code });
    const redirect_uri = `${process.env.KAKAO_REDIRECT_URL_IN_ROUTER}?token=${user.token}`;
    res.status(200).redirect(redirect_uri);
  } catch (err) {
    next(err);
  }
});

export { oauthRouter };
