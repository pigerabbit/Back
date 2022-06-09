import { Router } from "express";
import { recommendService } from "../services/recommendService";
import { login_required } from "../middlewares/login_required";

const recommendRouter = Router();

recommendRouter.post(
  "/recommend",
  recommendService,
  async function (req, res, next) {
    try {
      const userId = req.body.userId;
      const recommendedProduct = await recommendService.getRecommendedProduct({
        userId,
      });

      if (recommendedProduct.errorMessage) {
        throw new Error(recommendedProduct.errorMessage);
      }

      const body = {
        success: true,
        payload: recommendedProduct,
      };

      res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  }
);

export { toggleRouter };
