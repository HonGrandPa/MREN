import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"

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


app.use(express.json());
// "/api/user is a link and userRouter is exported from user.route with fun of "get""
app.use("/api/user", userRouter); // <- home
app.use("/api/auth", authRouter); // <-- sign up 

app.listen(port, () => {
  console.log(`connect to ${port}`);
});
