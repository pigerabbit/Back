import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { paymentController } from "../controllers/paymentController";

const paymentRouter = Router();

paymentRouter.post(
  "/payments",
  login_required,
  paymentController.createPayment
);

paymentRouter.put(
  "/payments/:paymentId",
  login_required,
  paymentController.updatePayment
);

paymentRouter.get(
  "/payments/:paymentId",
  login_required,
  paymentController.getPayment
);

export { paymentRouter };
