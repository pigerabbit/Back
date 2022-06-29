import { paymentService } from "../services/paymentService";

const paymentController = {
  createPayment: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const { groupId, dueDate, used, paymentMethod } = req.body;

      const newPayment = await paymentService.addPayment({
        userId,
        groupId,
        dueDate,
        used,
        paymentMethod,
      });

      if (newPayment.errorMessage) {
        throw new Error(newPayment.errorMessage);
      }

      const body = {
        success: true,
        payload: newPayment,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  updatePayment: async (req, res, next) => {
    try {
      const paymentId = req.params.paymentId;
      const dueDate = req.body.dueDate ?? null;
      const used = req.body.used ?? null;
      const voucher = req.body.voucher ?? null;
      const paymentMethod = req.body.paymentMethod ?? null;

      if (voucher < 0) {
        throw new Error("남은 사용권 개수가 0보다 작을 수 없습니다.");
      }

      const payment = await paymentService.setPayment({
        paymentId,
        dueDate,
        used,
        voucher,
        paymentMethod,
      });

      if (payment.errorMessage) {
        throw new Error(payment.errorMessage);
      }

      const body = {
        success: true,
        payload: payment,
      };

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  getPayment: async (req, res, next) => {
    try {
      const paymentId = req.params.paymentId;
      const userId = req.currentUserId;

      const payment = await paymentService.getPayment({
        paymentId,
        userId,
      });

      if (payment.errorMessage) {
        throw new Error(payment.errorMessage);
      }

      const body = {
        success: true,
        payload: payment,
      };

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  getPaymentByGroupAndUserId: async (req, res, next) => {
    try {
      const groupId = req.params.groupId;
      const userId = req.params.userId;

      const payment = await paymentService.getPaymentByGroupAndUserId({
        groupId,
        userId,
      });

      if (payment.errorMessage) {
        throw new Error(payment.errorMessage);
      }

      const body = {
        success: true,
        payload: payment,
      };

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },
};

export { paymentController };
