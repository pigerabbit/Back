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
      required: true,
    },
    used: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = model("Payment", PaymentSchema);

export { PaymentModel };
