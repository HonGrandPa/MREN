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
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }); //this return an object 
    if (user) { //exiting user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: honpapa, ...rest } = user._doc; //honpapa is empty to prevent password to return to the client 
      res //send the cookie to the client 
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      //.012312amweo <- generapassword ex
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      //console.log(req.body.userName.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4))
      const newUser = new User({
        userName: req.body.userName.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo
      })
      newUser.save()
        .then(result => {
          // If the user is saved successfully
          // Generate a JWT token
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
          // Extract properties from newUser, excluding the password
          const { password: honpapa, ...rest } = newUser._doc;
          // Send the JWT token as a cookie to the client
          res.cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });
          // Send the user data (excluding password) as a JSON response
          res.status(200).json(rest);
          // Log a message indicating the successful save
          console.log(`new google user: ${newUser.userName} has been saved`);
        })
        .catch(err => {
          // If there's an error during the save operation
          // Log the error
          console.log(`(Google) Error Occurred: ${err}`);
          // Pass the error to the next middleware or error handler
          next(err);
        });
    }
  } catch (err) {
    console.log(`(Google) Error Occurred (Try): ${err}`);
    next(err); //<-- send it to err handle middleware
  }
}

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json("User has been logged out")
  } catch (err) {
    next(err)
  }

}