import express from 'express';
import mongoose from 'mongoose';
import filemodel from '../models/file_storage.model.js';
import placemodel from '../models/place.model.js';
import visited_places from '../models/visited_places.model.js';
import coordinatemodel from '../models/places_coordinates.model.js';
export const upload_place = async (req, res) => {
    try {
        const name = req.file.filename;
        if (name!=null){
        const { lat, lng } = JSON.parse(req.body.coordinates);
        const specificObjectId =new mongoose.Types.ObjectId(req.body.user_id);
        // Create a new file record in the database
        const newFile = await filemodel.create({
            filename: name,
            filepath: `http://localhost:3000/images/${req.file.filename}`,
        });
        const newcoord=await coordinatemodel.create({
        location: {
        type: 'Point',
        coordinates: [lat, lng]
    },user_obj_id:specificObjectId,
    fileid:newFile._id,
        })
        console.log(newFile,newcoord);
        if (newFile!=null && newcoord!=null){
        const newPlace = await placemodel.create({
        user_obj_id: specificObjectId,
        place_name: req.body.placename,
        fileid:newFile._id,
        coordid:newcoord._id,
        story: req.body.story,
        likes: 0,
        type: req.body.type,
        });
        if (newPlace!=null){
        const visitPlace=await visited_places.create({
            user_obj_id:specificObjectId,
            places_obj_id:newPlace._id,
        });
         if (visitPlace!=null){
        // Sending response back
        res.status(201).json({ msg: 'Place and image uploaded successfully', place: newPlace, file: newFile });}
        else{
        await filemodel.findByIdAndDelete(newFile._id);
        await coordinatemodel.findByIdAndDelete(newcoord._id);
        await newPlace.findByIdAndDelete(newPlace._id);
        res.status(400).json({msg:'Couldnt store place due to some error'});
        }
    }else{
        await filemodel.findByIdAndDelete(newFile._id);
        await coordinatemodel.findByIdAndDelete(newcoord._id);
        res.status(400).json({msg:'Couldnt store place due to some error'});
    }
}else{
    res.staus(400).json({
        msg:"couldn't upload file or coordinates",
    })
}
        }
        else{
            res.staus(400).json({msg:'file not uploaded'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message:err});
    }
};
