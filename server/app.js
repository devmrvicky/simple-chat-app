import express from "express";
import { User } from "./model/user.model.js";
import { Message } from "./model/message.model.js";
import { setUsername } from "./service/auth.service.js";
import { checkAuth } from "./middleware/user.middleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ChatRoom } from "./model/chatRoom.model.js";
import { deleteUser } from "./controller/user/deleteUser.js";
import { createUser } from "./controller/user/createUser.js";
import { createChatRoom } from "./controller/chat/createChatRoom.js";
import { getAllUsers } from "./controller/user/getAllUsers.js";
import { pushChat } from "./controller/chat/pushChat.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.send("<h1>Hello guys</h1>");
});

// router
// create user router
app.post("/create-user", createUser);

app.delete("/delete-user", checkAuth, deleteUser);

// get all active user
app.get("/all-active-user", getAllUsers);

// create chat room
app.post("/create-chat-room", checkAuth, createChatRoom);

// any chatroom available
app.get("/chat-room/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const chatRooms = await ChatRoom.find({ friend: username });
    console.log(chatRooms);
    if (!chatRooms.length) {
      res.status(404).json({ status: false, message: "chat room not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "chatroom found", chatRooms });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// join chat room
app.put("/join-chat-room/:roomId", async (req, res) => {
  // const { roomId, friend } = req.body;
  const { roomId } = req.params;
  try {
    const chatRoom = await ChatRoom.findByIdAndUpdate(roomId, {
      availableToChat: false,
    });
    console.log("from join chat api");
    console.log(chatRoom);
    res.status(200).json({
      status: true,
      message: "user join chatroom successfully",
      chatRoom,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "unable to join chatroom" });
  }
});

// push message
app.put("/push-chat", pushChat);

// refresh chats
app.get("/get-updated-chats/:roomId", async (req, res) => {
  console.log(req.params);
  const { roomId } = req.params;
  try {
    const updatedChats = await ChatRoom.findById(roomId);
    if (!updatedChats) {
      res.status(404).json({ status: false, message: "chatroom not found" });
    }
    res.status(200).json({
      status: true,
      message: "get updated chats",
      updatedChatRoom: updatedChats,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// create message router
app.post("/create-message", checkAuth, async (req, res) => {
  const { message, receiver } = req.body;
  if (!message || !createdBy || !receiver) {
    res.status(400).json({
      status: false,
      message: "failed to create message. please try again",
    });
  }
  const createdMessage = await Message.create({
    message,
    createdBy: req.user._id,
    receiver,
  });

  if (createdMessage) {
    res.status(200).json({
      status: true,
      message: "message created successfully",
      createdMessage,
    });
  }
});

export { app };
