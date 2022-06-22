import { Schema, model } from "mongoose";

const ParticipantSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userInfo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  participantDate: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    required: false,
  },
  complete: {
    type: Boolean,
    required: true,
  },
  manager: {
    type: Boolean,
    required: true,
  },
  review: {
    type: Boolean,
    required: true,
  },
});

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
    groupName: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productInfo: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    remainedPersonnel: {
      type: Number,
      required: true,
      default: 0,
    },
    location: {
      type: String,
      required: false,
    },
    locationXY: {
      type: { type: String },
      coordinates: [Number],
    },
    deadline: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      required: true,
    },
    participants: [ParticipantSchema],
  },
  {
    timestamps: true,
  }
);

const GroupModel = model("Group", GroupSchema);

export { GroupModel };
