import { model, Schema } from "mongoose";

const chatRoomSchema = new Schema(
  {
    roomCreater: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friend: {
      type: String,
      required: true,
    },
    availableToChat: {
      type: Boolean,
      required: true,
    },
    chats: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        chat: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const ChatRoom = model("ChatRoom", chatRoomSchema);
