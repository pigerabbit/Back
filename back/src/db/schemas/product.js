import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
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
    minPurchase: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = model("Product", ProductSchema);

export { ProductModel };
