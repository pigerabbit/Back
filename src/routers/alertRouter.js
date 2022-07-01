import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { alertController } from "../controllers/alertController";

const alertRouter = Router();

/** user 알림 전체 보여주기 함수
 * 
 * param : id
 */
alertRouter.get(
  "/users/:id/alert",
  login_required,
  alertController.viewAlert
);

/** user 알림 삭제 함수
 * 
 * param : alertId
 */
 alertRouter.delete(
  "/users/:alertId/alert",
  login_required,
  alertController.deleteAlert
);


export { alertRouter };
