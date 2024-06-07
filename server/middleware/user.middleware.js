import { ChatRoom } from "../model/chatRoom.model.js";
import { User } from "../model/user.model.js";
import { getUsername } from "../service/auth.service.js";

const checkAuth = async (req, res, next) => {
  try {
    const username = req.cookies.username;
    if (!username) {
      res.status(404).json({
        status: false,
        message: "user not authorized to perform this action",
      });
    }
    const user = getUsername(username);
    if (!user) {
      res.status(404).json({ status: false, message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// const userAuthenticateToPushMessage = async (req, res, next) => {
//   const {username, chatRoom} = req.cookies;
//   const {_id} = await User.findOne({username})
//   await ChatRoom.findOne({
//     $or: [
//       {rooCreater: _id},
//       {friend: _id}
//     ]
//   })
// }

export { checkAuth };
