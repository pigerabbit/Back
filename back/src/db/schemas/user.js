import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    distance: {
      type: Number,
      required: false,
    },
    businessName: {
      type: String,
      required: false,
    },
    nickname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    seller: {
      type: Boolean,
      required: true,
      default: false,
    },
    imageLink: {
      type: String,
      required: false,
    },
    reportedBy: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);

export { UserModel };
