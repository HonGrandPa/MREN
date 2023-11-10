import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";

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

app.listen(port, () => {
  console.log(`connect to ${port}`);
});
