import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    message: {
      type: String,
      trim: true,
    },
    sendBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export const Message = model("Message", messageSchema);
