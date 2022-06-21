import { userService } from "../services/userService";

const alertController = {
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

  deleteAlert: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const sendId = req.params.sendId;
      await userService.deleteAlertList({ userId, sendId });

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