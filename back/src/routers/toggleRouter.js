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

export { toggleRouter };
