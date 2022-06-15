import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { locationService } from "../services/userService";
import { addressToXY } from "../utils/addressToXY.js";

const locationRouter = Router();

locationRouter.get(
  "/locations",
  login_required,
  async function (req, res, next) {
    try {
      const address = req.query.address;
      const data = await addressToXY(address);
      const body = {
        success: true,
        payload: data,
      };

      return res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

export { locationRouter };
