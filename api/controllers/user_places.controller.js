import express from 'express';
import mongoose from 'mongoose';
import filemodel from '../models/file_storage.model.js';
import placemodel from '../models/place.model.js';
import visited_places from '../models/visited_places.model.js';
export const upload_place = async (req, res) => {
    try {
        const name = req.file.filename;

        // Create a new file record in the database
        const newFile = await filemodel.create({
            filename: name,
            filepath: `http://localhost:3000/images/${req.file.filename}`,
        });
        
        const specificObjectId =new mongoose.Types.ObjectId(req.body.user_id);
        const newPlace = await placemodel.create({
        user_obj_id: specificObjectId,
        place_name: req.body.placename,
        fileid:newFile._id,
        story: req.body.story,
        likes: 0,
        type: req.body.type,
        });
        console.log(newPlace)
        const visitPlace=await visited_places.create({
            user_obj_id:specificObjectId,
            places_obj_id:newPlace._id,
        });
        const { lat, lng } = JSON.parse(req.body.coordinates);
        console.log(lat,lng);
        // Sending response back
        res.status(201).json({ message: 'Place and image uploaded successfully', place: newPlace, file: newFile });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
