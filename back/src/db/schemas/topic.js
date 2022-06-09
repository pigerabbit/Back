import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const TopicSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TopicModel = model("Topic", TopicSchema);

export { TopicModel };
