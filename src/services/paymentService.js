import { Payment } from "../db";
import crypto from "crypto";
import { PaymentModel } from "../db/schemas/payment";

export class paymentService {
  static async addPayment({ userId, productId, dueDate, used }) {
    const paymentId = crypto.randomUUID();

    const newPayment = {
      paymentId,
      userId,
      productId,
      dueDate,
      used,
    };

    const createdNewPayment = await Payment.create({ newPayment });

    return createdNewPayment;
  }

  static async setPayment({ paymentId, userId, dueDate, used }) {
    let paymentInfo = await Payment.findByPaymentId({
      paymentId,
    });

    if (!paymentInfo) {
      const errorMessage =
        "정보가 없습니다. paymentId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    if (userId !== paymentInfo.userId) {
      const errorMessage = "본인의 결제 내역이 아닙니다.";
      return { errorMessage };
    }

    if (dueDate !== null) {
      await PaymentModel.findOneAndUpdate(
        { paymentId },
        { $set: { dueDate } },
        { returnOriginal: false }
      );
    }

    if (used !== null) {
      await PaymentModel.findOneAndUpdate(
        { paymentId },
        { $set: { used } },
        { returnOriginal: false }
      );
    }

    const updatedPayment = await Payment.findByPaymentId({
      paymentId,
    });

    return updatedPayment;
  }
}
