import mongoose, { model } from "mongoose";
import express from "express";
import { spawn } from 'child_process';
import path from 'path';
import file_storages from '../models/file_storage.model.js'
import place_model from '../models/place.model.js'
import places_coordinates from'../models/places_coordinates.model.js'
import visited_places from "../models/visited_places.model.js";
import contactModel from "../models/contact.model.js";

const router=express.Router();

router.get('/top-rated',async(req,res)=>{
    try{
        const topratedplaces=await place_model.aggregate([{
            $lookup:{
                from: 'file_storages',
                localField: 'fileid',
                foreignField: '_id',
                as: 'file',
            },
        },{
                $project:{
                    user_obj_id: 1,
                    place_name: 1,
                    fileid: 1,
                    story: 1,
                    likes: 1,
                    type: 1,
                    filepath: { $arrayElemAt: ['$file.filepath', 0] },

                },
            },{
                $sort:{likes:-1},
            },{
                $limit:6,
            }
        ]);
        // console.log(topratedplaces);
        res.json(topratedplaces);

    }catch(err){
        res.status(404).json({
            status:"fail",
            message:err,
        });
    }

});
// string Username="661706ed7fb11f8af0e4b270";
// string password="password123;
router.get('/user-rec/:id/:name', async (req, res) => {
    try {
        const cppExecutable = path.join('C:/Users/shubh kamra/hideout_proj_daa/hideout-project-DTI/x64-debug/CMakeProject.exe');
        const child = spawn(cppExecutable);
        let processData = '';

        child.stdin.write(`${req.params.id}\n`);
        child.stdin.write(`${req.params.name}\n`);

        child.stdout.on('data', (data) => {
            processData += data.toString();
        });

        child.on('close', async () => {
            processData = processData.replace(/\r/g, '');
            processData = processData.trim();

            const dataLines = processData.split('\n');

            let dataarr = [];
            for (const element of dataLines) {
                if (element) {
                    const specificObjectId = new mongoose.Types.ObjectId(element);
                    const rec = await place_model.aggregate([
                        {
                            $lookup: {
                                from: 'file_storages',
                                localField: 'fileid',
                                foreignField: '_id',
                                as: 'file',
                            },
                        },
                        {
                            $match: { _id: specificObjectId },
                        },
                        {
                            $project: {
                                user_obj_id: 1,
                                place_name: 1,
                                fileid: 1,
                                story: 1,
                                likes: 1,
                                type: 1,
                                filepath: { $arrayElemAt: ['$file.filepath', 0] },
                            },
                        },
                    ]);

                    dataarr.push(rec);
                }
            }

            let flattenedArray = [].concat(...dataarr);
            
            if (flattenedArray.length === 0) {
                // No recommendations found
                res.status(404).json({ message: 'No recommendations found' });
            } else {
                // Recommendations found, send response
                res.json(flattenedArray);
            }
        });

        child.on('error', (err) => {
            console.error('Error executing child process:', err);
            res.status(500).json({ message: 'Internal server error' });
        });

        child.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/user_uploads/:id',async(req,res)=>{
    try{
        const specificObjectId =new mongoose.Types.ObjectId(req.params.id);
        const places=await place_model.aggregate([{
            $lookup:{
                from: 'file_storages',
                localField: 'fileid',
                foreignField: '_id',
                as: 'file',
            },
        },{
            $match:{user_obj_id:specificObjectId},
        },{
            $project:{
                user_obj_id: 1,
                place_name: 1,
                fileid: 1,
                story: 1,
                likes: 1,
                type: 1,
                filepath: { $arrayElemAt: ['$file.filepath', 0] },

            },

        }]);
        if (places!=null){
            res.status(200).json(places);
        }
        else{
            res.status(400).json({
                status:'erro',
                msg:'no user found with that id or user has not uploaded any places'
            })
        }
        }
        catch(Err){
            res.status(404).json({
                status:'fail',
                msg:Err,
            });
        }
});
router.get('/getplace/:id', async (req, res) => {
    try {
        console.log(`id:--------------------${req.params.id}`);
        const specificObjectId = new mongoose.Types.ObjectId(req.params.id);
        const rec = await place_model.aggregate([
            {
                $match: { _id: specificObjectId }
            },
            {
                $lookup: {
                    from: 'file_storages',
                    localField: 'fileid',
                    foreignField: '_id',
                    as: 'file'
                }
            },
            {
                $lookup: {
                    from: 'places_coordinates',
                    localField: 'coordid',
                    foreignField: '_id',
                    as: 'coord'
                }
            },{
                $lookup:{
                    from:'users',
                    localField:'user_obj_id',
                    foreignField:'_id',
                    as :'user'
                }
            },
            {
                $project: {
                    user_obj_id: 1,
                    place_name: 1,
                    fileid: 1,
                    story: 1,
                    likes: 1,
                    type: 1,
                    filepath: { $arrayElemAt: ['$file.filepath', 0] },
                    coordinates: { $arrayElemAt: ['$coord.location.coordinates', 0] },
                    username:{$arrayElemAt:['$user.username',0]}
                }
            }
        ]);
        console.log(rec);
        res.json(rec);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/addtovisited/:id',async(req,res)=>{
    try{
        const specificuserid=new mongoose.Types.ObjectId(req.body.user_obj_id);
        const specificObjectId=new mongoose.Types.ObjectId(req.params.id);
        const visitedPlace=await visited_places.findOne({user_obj_id:specificuserid,places_obj_id:specificObjectId});
        if (visitedPlace){
            res.json({
                visited:true,
                msg:'place already in visited',
            });
        }
        else{
            const newviist=await visited_places.create({
                user_obj_id:specificuserid,
                places_obj_id:specificObjectId,
            });
            res.status(201).json({ msg: 'Place added to visited places successfully.',visited:true });
        }
    }
    catch (error) {
        // Handle any errors that occur during the process
        console.error('Error adding place to visited places:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
});
router.get('/georec', async (req, res) => {
    try {
        const lat = parseFloat(req.query.latitude);
        const lng = parseFloat(req.query.longitude);
        const dist = parseFloat(req.query.maxDistance);

        // Fetch visited places for the specific user
        const specificUserId = new mongoose.Types.ObjectId(req.query.userId);
        const visitedPlaces = await visited_places.find({ user_obj_id: specificUserId }, { places_obj_id: 1 });
        const visitedPlaceIds = visitedPlaces.map(place => place.places_obj_id);

        // Perform aggregation to fetch georecommendations excluding visited places
        const result = await places_coordinates.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [lat, lng]
                    },
                    distanceField: "distance",
                    maxDistance: dist,
                    spherical: true
                }
            },
            {
                $lookup: {
                    from: "places",
                    localField: "_id",
                    foreignField: "coordid",
                    as: "place"
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_obj_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'file_storages',
                    localField: 'fileid',
                    foreignField: '_id',
                    as: 'file'
                }
            },
            {
                $project: {
                    user_obj_id: 1,
                    place_name: { $arrayElemAt: ["$place.place_name", 0] },
                    place_id:{ $arrayElemAt: ["$place._id", 0] },
                    fileid: { $arrayElemAt: ["$place.fileid", 0] },
                    story: { $arrayElemAt: ["$place.story", 0] },
                    likes: { $arrayElemAt: ["$place.likes", 0] },
                    type: { $arrayElemAt: ["$place.type", 0] },
                    filepath: { $arrayElemAt: ["$file.filepath", 0] },
                    username: { $arrayElemAt: ["$user.username ", 0] },
                    location: 1,
                    distance: 1
                }
            },      {
                $match: {
                    "place_id": { $nin: visitedPlaceIds } // Filter out visited places
                }
            },
        ]);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching georecommendations:', error);
        res.status(500).json({ error: 'An error occurred while fetching georecommendations' });
    }
});
router.get('/type-rec/random', async (req, res) => {
    try {
        const specificUserId = req.query.userId;

        // Fetch visited places for the specific user
        const visitedPlaces = await visited_places.find({ user_obj_id: specificUserId });
        if (visitedPlaces.length === 0) {
            return res.status(404).json({ error: 'User has not visited any places yet' });
        }

        const visitedPlaceIds = visitedPlaces.map(place => place.places_obj_id);

        // Get a random visited place of the user
        const randomVisitedPlace = visitedPlaces[Math.floor(Math.random() * visitedPlaces.length)];
        const place = await place_model.findOne({ _id: randomVisitedPlace.places_obj_id });
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        // Ensure the place object has a type property
        if (!place.type) {
            return res.status(400).json({ error: 'Type field is missing in the place document' });
        }

        // Fetch recommendations based on the randomly selected type, excluding visited places
        const recommendations = await place_model.aggregate([
            {
                $match: {
                    type: place.type, // Filter by the randomly selected type
                    _id: { $nin: visitedPlaceIds } // Exclude visited places
                }
            },
            {
                $lookup: {
                    from: 'file_storages',
                    localField: 'fileid',
                    foreignField: '_id',
                    as: 'file'
                }
            },
            {
                $project: {
                    _id: 1,
                    user_obj_id: 1,
                    place_name: 1,
                    fileid: 1,
                    story: 1,
                    likes: 1,
                    type: 1,
                    filepath: { $arrayElemAt: ['$file.filepath', 0] }
                }
            }
        ]);

        res.status(200).json({ type: place.type, recommendations });
    } catch (error) {
        console.error('Error fetching recommendations based on type:', error);
        res.status(500).json({ error: 'An error occurred while fetching recommendations based on type' });
    }
});
router.post('/contact', async (req, res) => {
    try {
      const { email, subject, message } = req.body;
  
      // Create a new contact document
      const newContact = new contactModel({
        email,
        subject,
        message
      });
  
      // Save the contact document to the database
      await newContact.save();
  
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });
export default router;

