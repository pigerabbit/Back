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
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
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
