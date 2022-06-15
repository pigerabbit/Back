import { Router } from "express";
import { toggleService } from "../services/toggleService";
import { login_required } from "../middlewares/login_required";

const toggleRouter = Router();

toggleRouter.post(
  "/toggles",
  login_required,
  async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    const newToggle = await toggleService.addToggle({
      userId,
    });

    if (newToggle.errorMessage) {
      throw new Error(newToggle.errorMessage);
    }

    res.status(201).json(newToggle);
  } catch (error) {
    next(error);
  }
});

toggleRouter.put(
  "/toggle/group/:objectId",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const objectId = req.params.objectId;

      const toUpdate = { objectId };
      const updatedGroupInfo = await toggleService.setToggleGroup({
        userId,
        toUpdate,
      });

      if (updatedGroupInfo.errorMessage) {
        throw new Error(updatedGroupInfo.errorMessage);
      }

      res.status(200).json(updatedGroupInfo);
    } catch (error) {
      next(error);
    }
  }
);

toggleRouter.put(
  "/toggle/product/:objectId",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const objectId = req.params.objectId;

      const toUpdate = { objectId };
      const updatedProductInfo = await toggleService.setToggleProduct({
        userId,
        toUpdate,
      });

      if (updatedProductInfo.errorMessage) {
        throw new Error(updatedProductInfo.errorMessage);
      }

      res.status(200).json(updatedProductInfo);
    } catch (error) {
      next(error);
    }
  }
);

toggleRouter.put(
  "/toggle/searchWord/:searchWord",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const searchWord = req.params.searchWord;

      const toUpdate = { searchWord };
      const updatedSearchWordInfo = await toggleService.setToggleSearchWord({
        userId,
        toUpdate,
      });

      if (updatedSearchWordInfo.errorMessage) {
        throw new Error(updatedSearchWordInfo.errorMessage);
      }

      res.status(200).json(updatedSearchWordInfo);
    } catch (error) {
      next(error);
    }
  }
);

toggleRouter.get(
  "/toggle/groups",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;

      const toggleInfo = await toggleService.getToggleGroup({ userId });

      if (toggleInfo.errorMessage) {
        throw new Error(toggleInfo.errorMessage);
      }

      res.status(200).json(toggleInfo);
    } catch (error) {
      next(error);
    }
  }
);

toggleRouter.get(
  "/toggle/products",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;

      const toggleInfo = await toggleService.getToggleProduct({ userId });

      if (toggleInfo.errorMessage) {
        throw new Error(toggleInfo.errorMessage);
      }

      res.status(200).json(toggleInfo);
    } catch (error) {
      next(error);
    }
  }
);

toggleRouter.get(
  "/toggle/searchWords",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;

      const toggleInfo = await toggleService.getToggleSearchWords({ userId });

      if (toggleInfo.errorMessage) {
        throw new Error(toggleInfo.errorMessage);
      }

      res.status(200).json(toggleInfo);
    } catch (error) {
      next(error);
    }
  }
);

toggleRouter.put(
  "/toggle/viewedProducts/:objectId",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const objectId = req.params.objectId;

      const toUpdate = { objectId };
      const updatedViewedProductsInfo =
        await toggleService.setToggleViewedProducts({
          userId,
          toUpdate,
        });

      if (updatedViewedProductsInfo.errorMessage) {
        throw new Error(updatedViewedProductsInfo.errorMessage);
      }

      res.status(200).json(updatedViewedProductsInfo);
    } catch (error) {
      next(error);
    }
  }
);

toggleRouter.get(
  "/toggle/viewedProducts",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;

      const toggleInfo = await toggleService.getToggleViewedProducts({
        userId,
      });

      if (toggleInfo.errorMessage) {
        throw new Error(toggleInfo.errorMessage);
      }

      res.status(200).json(toggleInfo);
    } catch (error) {
      next(error);
    }
  }
);

export { toggleRouter };
