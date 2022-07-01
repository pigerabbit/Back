import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { recommendController } from "../controllers/recommendController";

const recommendRouter = Router();

recommendRouter.get(
  "/recommendations",
  login_required,
  recommendController.getRecommendation
);

recommendRouter.get(
  "/recommendations/group",
  login_required,
  recommendController.getRecommendationGroup
);

export { recommendRouter };
