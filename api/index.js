import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js"

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch((err) => {
    console.log(`Error ${err}`);
  });

const app = express();
const port = 3000;

// "/api/user is a link and userRouter is exported from user.route with fun of "get""
app.use("/api/user", userRouter)

app.listen(port, () => {
  console.log(`connect to ${port}`);
});
