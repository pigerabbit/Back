import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { locationRouter } from "../services/userService";

const alertRouter = Router();

alertRouter.post(
  "/locations/",
  login_required,
  async function (req, res, next) {
    try {
      const x = req.body.x;
      const y = req.body.y;
      const radius = req.body.radius;

      const body = {
        success: true,
        payload: alertList,
      };

      return res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

export { locationRouter };
