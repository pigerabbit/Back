import { Schema, model } from "mongoose";

const GroupSchema = new Schema(
  {
    groupId: {
      type: String,
      required: true,
    },
    groupType: {
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
    notPaid: {
      type: [String],
      required: false,
    },
    productId: {
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
