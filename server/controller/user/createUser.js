import { ChatRoom } from "../../model/chatRoom.model.js";
import { User } from "../../model/user.model.js";
import { setUsername } from "../../service/auth.service.js";

const createUser = async (req, res) => {
  const prevUsername = req.cookies.username;
  const chatRoomId = req.cookies.chatRoom;
  if (prevUsername) {
    // delete this one
    await User.findOneAndDelete({ username: prevUsername });
  }
  if (chatRoomId) {
    await ChatRoom.findByIdAndDelete(chatRoomId);
  }
  console.log(req.body);
  // return;
  const { name, username } = req.body;
  if ([name, username].some((value) => value === "")) {
    res.status(400).json({ status: false, message: "all fields are required" });
    // throw new Error("all fields are required")
  }

  const user = await User.create({
    name,
    username,
  });

  if (!user) {
    res.status(400).json({
      status: false,
      message: "fail to create user. please try again!",
    });
  }

  // set username
  setUsername(username, user);

  res
    .status(200)
    .cookie("username", username, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "Lax", // Use 'None' for cross-site cookies
      domain: "localhost", // Do not include the protocol
      path: "/", // Ensure the path is set correctly
    })
    .json({
      status: true,
      message: "user created successfully",
      user,
    });
};

export { createUser };
