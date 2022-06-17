import { recommendService } from "../services/recommendService";

const recommendController = {
  getRecommendation: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      let page = req.query.page ?? null;
      let perPage = req.query.perPage ?? null;

      if (page <= 0 || perPage <= 0) {
        if (page !== null || perPage !== null) {
          let body = {
            success: false,
            errorMessage: "잘못된 페이지를 입력하셨습니다.",
          };

          return res.status(400).send(body);
        }
      }

      if (page == null && perPage == null) {
        page = 1;
        perPage = -1;
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
  },

  getRecommendationGroup: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      let page = req.query.page ?? null;
      let perPage = req.query.perPage ?? null;

      if (page <= 0 || perPage <= 0) {
        if (page !== null || perPage !== null) {
          let body = {
            success: false,
            errorMessage: "잘못된 페이지를 입력하셨습니다.",
          };

          return res.status(400).send(body);
        }
      }

      if (page == null && perPage == null) {
        page = 1;
        perPage = -1;
      }

      const recommendedGroup = await recommendService.getRecommendedGroup({
        userId,
        page,
        perPage,
      });

      if (recommendedGroup.errorMessage) {
        throw new Error(recommendedGroup.errorMessage);
      }

      const body = {
        success: true,
        payload: recommendedGroup,
      };

      res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },
};

export { recommendController };
