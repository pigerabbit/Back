import { Router } from "express";
import { toggleService } from "../services/toggleService";
import { login_required } from "../middlewares/login_required";

const toggleRouter = Router();

toggleRouter.post("/toggles", async function (req, res, next) {
  try {
    const userId = req.body.userId;
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
  "/toggle/group/:groupId",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;

      const toUpdate = { groupId };
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
  "/toggle/product/:productId",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const productId = req.params.productId;

      const toUpdate = { productId };
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

export { toggleRouter };
