import { userService } from "../services/userService";

const alertController = {
  // 알림 전체 보여주기 함수
  viewAlert: async (req, res, next) => {
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
  },

  // 알림 삭제 함수
  deleteAlert: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const alertId = req.params.alertId;
      await userService.deleteAlertList({ userId, alertId });

      const body = {
        success: true,
        payload: "삭제가 완료되었습니다.",
      };

      return res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },
};

export { alertController };