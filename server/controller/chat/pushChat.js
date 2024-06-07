import { ChatRoom } from "../../model/chatRoom.model.js";

const pushChat = async (req, res) => {
  const { senderId, chat, roomId } = req.body;
  try {
    const updatedChatRoom = await ChatRoom.findByIdAndUpdate(
      roomId,
      {
        $push: {
          chats: {
            sender: senderId,
            chat: chat,
          },
        },
      },
      { new: true } // Return the updated document
    );
    if (!updatedChatRoom) {
      return res
        .status(404)
        .json({ status: false, message: "Chat room not found" });
    }

    res.status(200).json({
      status: true,
      message: "message send successfully",
      chatRoom: updatedChatRoom,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export { pushChat };
