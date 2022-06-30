import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    postId: {
      type: String,
      unique: true,
      required: true,
    },
    groupId: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    authorizedUsers: {
      type: [String],
      required: true,
    },
    writer: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    postImg: {
      type: String,
      required: false,
    },
    commentCount: {
      type: Number,
      required: true,
      default: 0,
    },
    reply: {
      type: Boolean,
      required: false,
      default: false,
    },
    removed: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Post", PostSchema);

export { PostModel };
