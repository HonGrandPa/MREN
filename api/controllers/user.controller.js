import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcrypt'

export const test = (req, res) => {

    res.json({

        message: "Hello world"
    });
};

export const updateUser = async (req, res, next) => {

    console.log(req.user)
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account'));
    try {
        if(req.body.password) {
            console.log("re-hash passowrd")
            req.body.password = bcrypt.hashSync(req.body.password, 10);     
        }
        const updateUser = await User.findByIdAndUpdate(req.user.id, {    
            $set: {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }

        }, {new: true})
        if(!updateUser) return next(errorHandler(404, 'Cannot find the user'))
        const {password:HaHaha, ...rest} = updateUser._doc
        res.status(200).json(rest)
    } catch (err) {

        next(err);
    }

}

export const deleteUser = async (req, res, next) => {

    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own account"));
    }

    try {

        await User.findByIdAndDelete(req.user.id);
        res.clearCookie('access_token'); //<---unauthurized the user
        res.status(200).json("User has been deleted");

    } catch (err) {
        next(err);
    }

}

export const getUserListings = async (req, res, next) => {

    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only view your own listong!'));
    }

    try {
        const listings = await Listing.find({userRef: req.user.id});
        res.status(200).json(listings);
    } catch(err) {

        next(err);
    }

 
}