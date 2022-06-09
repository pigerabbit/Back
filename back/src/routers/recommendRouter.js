import { Router } from "express";
import { recommendService } from "../services/recommendService";
import { login_required } from "../middlewares/login_required";

const recommendRouter = Router();

recommendRouter.get(
  "/recommend",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const { page, perPage } = req.query;

      if (page <= 0 || perPage <= 0) {
        const body = {
          success: false,
          errorMessage: "잘못된 페이지를 입력하셨습니다.",
        };

        return res.status(400).send(body);
      }

      const recommendedProduct = await recommendService.getRecommendedProduct({
        userId,
        page,
        perPage,
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

export { recommendRouter };
