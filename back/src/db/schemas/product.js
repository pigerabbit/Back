import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userInfo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    id: {
      type: String,
      required: true,
    },
    images: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    descriptionImg: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    discountRate: {
      type: Number,
      required: true,
    },
    minPurchaseQty: {
      type: Number,
      required: true,
    },
    maxPurchaseQty: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 1,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    shippingFeeCon: {
      type: Number,
      required: true,
      default: 0,
    },
    detail: {
      type: String,
    },
    detailImg: {
      type: String,
    },
    shippingInfo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = model("Product", ProductSchema);


export { ProductModel };