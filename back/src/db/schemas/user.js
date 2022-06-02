import { Schema, model } from "mongoose";

const alertSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  sendId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  removed: {
    type: Boolean,
    required: true, 
    default: false,
  },
});

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
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
      unique: true,
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
      default:
        "https://bobpullbucket.s3.ap-northeast-2.amazonaws.com/default-rabbit.jpg",
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
    alert: [alertSchema],
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);

export { UserModel };
