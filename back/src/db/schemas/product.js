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
    }
  },
  {
    timestamps: true,
  }
);

const ProductModel = model("Product", ProductSchema);

export { ProductModel };
