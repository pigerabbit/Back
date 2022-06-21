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
    },
    used: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = model("Payment", PaymentSchema);

export { PaymentModel };
