import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { toggleController } from "../controllers/toggleController";

const toggleRouter = Router();

toggleRouter.post("/toggles", login_required, toggleController.createToggle);

toggleRouter.put(
  "/toggle/group/:objectId",
  login_required,
  toggleController.updateToggleGroup
);

toggleRouter.put(
  "/toggle/product/:objectId",
  login_required,
  toggleController.updateToggleProduct
);

toggleRouter.put(
  "/toggle/searchWord/:searchWord",
  login_required,
  toggleController.updateToggleSearchWord
);

toggleRouter.delete(
  "/toggle/searchWord/:searchWord",
  login_required,
  toggleController.deleteToggleSearchWord
);

toggleRouter.get(
  "/toggle/groups",
  login_required,
  toggleController.getToggleGroups
);

toggleRouter.get(
  "/toggle/products",
  login_required,
  toggleController.getToggleProducts
);

toggleRouter.get(
  "/toggle/searchWords",
  login_required,
  toggleController.getToggleSearchWords
);

toggleRouter.put(
  "/toggle/viewedProducts/:objectId",
  login_required,
  toggleController.updateToggleViewedProducts
);

toggleRouter.get(
  "/toggle/viewedProducts",
  login_required,
  toggleController.ToggleViewedProducts
);

export { toggleRouter };
