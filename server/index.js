import mongoose from "mongoose";
import { app } from "./app.js";

const PORT = 8000;

mongoose
  .connect("mongodb://localhost:27017/simple-chat-app")
  .then(() => {
    console.log("database connected successfully");
    app.listen(PORT, () => {
      console.log("server connected on port " + PORT);
    });
  })
  .catch((error) => console.log(error));
