import { User } from "../../model/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({
        status: false,
        message: "there is not single active user right now",
      });
    }
    res
      .status(200)
      .json({ status: true, message: "get all user successfully", users });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export { getAllUsers };
