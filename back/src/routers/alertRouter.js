import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { userService } from "../services/userService";

/** user 알림 전체 보여주기 함수
 * 
 * param : id
 */
 alertRouter.get(
  "/users/:id/alert",
  login_required,
  async function (req, res, next) {
    try {
      const currentUserId = req.currentUserId;
      const userId = req.params.id;
      const alertList = await userService.getAlertList({ currentUserId, userId });

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

/** user 알림 삭제 함수
 * 
 * param : sendId
 */
 alertRouter.delete(
  "/users/:sendId/alert",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const sendId = req.params.sendId;
      const alertList = await userService.deleteAlertList({ userId, sendId });

      const body = {
        success: true,
        payload: "삭제가 완료되었습니다.",
      };

      return res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);


export { alertRouter };