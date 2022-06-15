import { Router } from "express";
import { login_required } from "../middlewares/login_required";

import { locationController } from "../controllers/locationController";

const locationRouter = Router();

locationRouter.get(
  "/locations",
  login_required,
  locationController.getLocation
);

export { locationRouter };
