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
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    imageLink: {
      type: String,
      required: false,
    },
    reportedBy: {
      type: [String],
      required: false,
    },
    deleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);

export { UserModel };
