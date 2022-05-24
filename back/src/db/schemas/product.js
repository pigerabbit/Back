import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    }, 
    id: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
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
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    // group API에 들어간다면 스웨거도 변경 필요
    minPurchaseQty: {
      type: Number,
      required: false,
    },
    maxPurchaseQty: {
      type: Number,
      required: false,
    },
    dueDate: {
      type: Date,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const ProductModel = model("Product", ProductSchema);

export { ProductModel };
