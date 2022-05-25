import { Schema, model } from "mongoose";

const authEmailSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  status: {
    type: Number,
    required: true,
  },
  activateKey: {
    type: String,
    required: true,
  },
});
const AuthEmailModel = model("authemail", authEmailSchema);

export { AuthEmailModel };
