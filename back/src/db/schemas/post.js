import mongoose from "mongoose";
const Schema = mongoose.Schema;
const model = mongoose.model;

const PostSchema = new Schema(
  {
    postId: {
      type: String,
      unique: true,
      required: true,
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
