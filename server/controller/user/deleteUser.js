import { User } from "../../model/user.model.js";
import { getUsername } from "../../service/auth.service.js";

const deleteUser = async (req, res) => {
  try {
    const username = req.cookies.username;
    if (!username) return;
    const user = getUsername(username);
    if (!user) {
      res.status(404).json({ status: false, message: "user not found" });
    }
    const deletedUser = await User.findByIdAndDelete(user._id);
    if (!deletedUser) {
      res.status(500).json({
        status: false,
        message: "user can't delete. please try again!",
      });
    }
    res.status(200).json({
      status: true,
      message: "user deleted successfully.",
      deletedUser,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export { deleteUser };
