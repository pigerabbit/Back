import { toggleService } from "../services/toggleService";

const toggleController = {
  createToggle: async (req, res, next) => {
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
  },

  updateToggleGroup: async (req, res, next) => {
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
  },

  updateToggleProduct: async (req, res, next) => {
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
  },

  updateToggleSearchWord: async (req, res, next) => {
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
  },

  getToggleGroups: async (req, res, next) => {
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
  },

  getToggleProducts: async (req, res, next) => {
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
  },

  getToggleSearchWords: async (req, res, next) => {
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
  },

  updateToggleViewedProducts: async (req, res, next) => {
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
  },

  ToggleViewedProducts: async (req, res, next) => {
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
  },
};

export { toggleController };
