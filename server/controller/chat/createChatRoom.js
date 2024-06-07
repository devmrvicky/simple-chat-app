import { ChatRoom } from "../../model/chatRoom.model.js";

const createChatRoom = async (req, res) => {
  const { friend } = req.body;
  try {
    console.log(req.user);
    const chatRoom = await ChatRoom.create({
      roomCreater: req.user._id,
      friend,
      availableToChat: true,
      chats: [],
    });
    if (!chatRoom) {
      res
        .status(500)
        .json({ status: false, message: "chatroom cant't create" });
    }
    res
      .status(200)
      .cookie("chatRoom", chatRoom._id)
      .json({ status: true, message: "welcome to chatroom", chatRoom });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export { createChatRoom };
