import { Schema, model } from "mongoose";

const PaymentSchema = new Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    dueDate: {
      type: String,
      required: false,
      default: "2000-01-01 00:00:00",
    },
    used: {
      type: Boolean,
      required: false,
      default: false,
    },
    voucher: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = model("Payment", PaymentSchema);

export { PaymentModel };
