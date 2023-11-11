import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import { errorHandler } from "../utils/error.js";



export const signup = async (req, res, next) => {

    const { userName, email, password } = req.body; //req.body is from client

    const bcryptPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        userName,
        email,
        password: bcryptPassword
    });

    await newUser.save()
        .then(result => {
            console.log(`new user: ${newUser.userName} has been saved`);
            res.status(201).json({ message: "New User has been saved" })
        })
        .catch(err => {
            console.log(`Error Occur : ${err}`);
            next(err);
            // next(errorHandler(550, 'eeror from the function'));
        });



}