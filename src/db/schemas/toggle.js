import { Schema, model } from "mongoose";

const ToggleSchema = new Schema({
  toggleId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: false,
    },
  ],
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
  ],
  viewedProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
  ],
  searchWords: {
    type: [String],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const ToggleModel = model("Toggle", ToggleSchema);

export { ToggleModel };
