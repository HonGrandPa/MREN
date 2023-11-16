import { list } from "tar";
import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";
import { json } from "express";




export const createListing = async (req, res, next) => {


    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (err) {
        next(err);
    }
}

export const deleteListing = async (req, res, next) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }

    if (req.user.id !== listing.userRef.toString()) {
        return next(errorHandler(401, 'You can only delete your own listings'));
    }

    try {

        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Successfully Deleted")
    } catch (err) {

        next(err);
    }

}

export const updateListing = async (req, res, next) => {

    const listing = await Listing.findById(req.params.id);

    if(!listing) {

        return (next(errorHandler(404, 'Listing not found')))

    } 

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only update you own listing!'))
    }

    try {
        const updated = await Listing.findByIdAndUpdate(
            req.params.id, 
            req.body,
            {new: true});
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "can't find the list"))
        }
        res.status(200).json(listing);
    } catch (err) {

        next(err);
    }
}

export const getListings = async (req, res, next) => {
    try {

        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer; //true;false/undefined


        //when clinet loging offer parking and funrnished are show by default 
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true]};
        }

        let furnished = req.query.furnished; //true;false/undefined


        //when clinet loging offer parking and funrnished are show by default 
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true]};
        }

        let parking = req.query.parking; //true;false/undefined


        //when clinet loging offer parking and funrnished are show by default 
        if (parking === undefined || parking === 'false') {
            parking = {$in: [false, true]}
        }

        let type = req.query.type;

        if(type === undefined || type === "all") {
            type = {$in: ['sell', 'rent']};
        }   

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt'

        const order = req.query.order || 'desc';

        const listing = await Listing.find({

            name: {
                $regex: searchTerm, $options: 'i'
            }, offer, furnished, parking, type
        }).sort(
            {[sort]: order}
        ).limit(limit).skip(startIndex);


        res.status(200).json(listing);

    } catch (error) {
        next(error);
    }
}