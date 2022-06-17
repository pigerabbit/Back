import { paymentService } from "../services/paymentService";

const paymentController = {
  createPayment: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const { productId, dueDate, used } = req.body;

      const newPayment = await paymentService.addPayment({
        userId,
        productId,
        dueDate,
        used,
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
      const userId = req.currentUserId;
      const dueDate = req.body.dueDate ?? null;
      const used = req.body.used ?? null;

      const payment = await paymentService.setPayment({
        paymentId,
        userId,
        dueDate,
        used,
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
