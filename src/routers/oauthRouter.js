import { Router } from "express";
import { oauthController } from "../controllers/oauthController";

const oauthRouter = Router();

oauthRouter.post("/oauth/login", oauthController.login);

export { oauthRouter };
