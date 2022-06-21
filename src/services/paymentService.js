import { Payment, Group, User } from "../db";
import crypto from "crypto";
import { PaymentModel } from "../db/schemas/payment";

export class paymentService {
  static async addPayment({ userId, groupId, used }) {
    const paymentId = crypto.randomUUID();

    const newPayment = {
      paymentId,
      userId,
      groupId,
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

  static async getPayment({ paymentId, userId }) {
    const paymentInfo = await Payment.findByPaymentId({
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

    return paymentInfo;
  }

  static async getPaymentByGroupAndUserId({ groupId, userId }) {
    const groupInfo = await Group.findByGroupIdByObjectId({
      _id: groupId,
    });

    if (groupInfo === null) {
      const errorMessage = "존재하지 않는 groupId입니다.";
      return { errorMessage };
    }

    const userInfo = await User.findById({ userId });

    if (userInfo === null) {
      const errorMessage = "존재하지 않는 userId입니다.";
      return { errorMessage };
    }

    const paymentInfo = await Payment.findByGroupAndUserId({
      groupId,
      userId,
    });

    if (paymentInfo === null) {
      const errorMessage = "존재하지 않는 paymentId입니다.";
      return { errorMessage };
    }

    return paymentInfo;
  }
}
