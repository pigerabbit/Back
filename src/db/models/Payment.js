import { PaymentModel } from "../schemas/payment";

class Payment {
  static async create({ newPayment }) {
    const createdNewPayment = await PaymentModel.create(newPayment);
    return createdNewPayment;
  }

  static async findByPaymentId({ paymentId }) {
    const paymentInfo = await PaymentModel.findOne({ paymentId });
    return paymentInfo;
  }

  static async findByGroupAndUserId({ groupId, userId }) {
    const paymentInfo = await PaymentModel.findOne({
      groupId,
      userId,
    });

    return paymentInfo;
  }
}

export { Payment };
