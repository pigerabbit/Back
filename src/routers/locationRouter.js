import { Router } from "express";
import { login_required } from "../middlewares/login_required";

import { locationController } from "../controllers/locationController";

const locationRouter = Router();

// 주소를 위도 경도로 변환해주는 API
locationRouter.get(
  "/locations",
  login_required,
  locationController.getLocation
);

export { locationRouter };
