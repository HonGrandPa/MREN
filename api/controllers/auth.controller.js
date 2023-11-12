import User from "../models/user.model.js";
import bcrypt, { compare, hash } from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body; //req.body is from client

  // const bcryptPassword = bcrypt.hashSync(password, 10)

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log(`Fail to hash password due to Error: ${err}`);
      next(err);
    }
    const newUser = new User({
      userName,
      email,
      password: hash,
    });
    newUser
      .save()
      .then((result) => {
        console.log(`new user: ${newUser.userName} has been saved`);
        res.status(201).json({ message: "New User has been saved" });
      })
      .catch((err) => {
        console.log(`Error Occur : ${err}`);
        next(err);
        // next(errorHandler(550, 'eeror from the function'));
      });
  });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "Wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: honpapa, ...rest } = validUser._doc; //honpapa is empty to prevent password to return to the client 
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};
// const newUser = new User({
//     userName,
//     email,
//     password: bcryptPassword
// });
