import { Schema, model } from "mongoose";

const GroupSchema = new Schema(
  {
    group_id: {
      type: String,
      required: true,
    },
    group_type: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    participants: {
      type: [String],
      required: false,
    },
    not_paid: {
      type: [String],
      required: false,
    },
    product_id: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GroupModel = model("Group", GroupSchema);

export { GroupModel };
