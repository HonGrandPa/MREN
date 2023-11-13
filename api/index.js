import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";

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
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// "/api/user is a link and userRouter is exported from user.route with fun of "get""
app.use("/api/user", userRouter); // <- home
app.use("/api/auth", authRouter); // <-- sign up 

app.use((err, req, res, next) => {// <-- error handle middleware function

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
      success: false,
      statusCode: statusCode,
      message : message
    });

});

app.listen(port, () => {
  console.log(`connect to ${port}`);
});
