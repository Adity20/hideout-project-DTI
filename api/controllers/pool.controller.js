import mongoose from "mongoose";
import Pool from "../models/pool.model.js";

mongoose.connect('mongodb://localhost:27017/hideout', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export const addtrip = async (req, res) => {
    try {
        console.log(req.body);
        const add = await Pool.create({
            user_obj_id: req.body.user_obj_id,
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate,
            Origin: req.body.Origin,
            Destination: req.body.Destination,
            Budget: req.body.Budget,
            Description: req.body.Description,
            MaxCapacity: req.body.MaxCapacity,
            PassengersLeft:req.body.MaxCapacity,
        });
        if (add) {
            res.status(201).json({
                msg: "Trip created successfully",
                status: "success"
            });
        } else {
            res.status(400).json({
                msg: "Some field is missing",
                status: "error"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal server error",
            status: "fail"
        });
    }
}

export const getonetrip=async(req,res)=>{
    try{
        const id=req.params.id;
        const result=await Pool.find({_id:id});
        if (result!=null){
            res.status(200).json(result);
        }
        else{
            res.status(400).json({msg:"could not find ride"});
        }
    }
    catch(err){
        res.status(404).json({msg:err});
    }
}

export const getalltrips=async(req,res)=>{
    try{
        const result=await Pool.find({});
        if (result!=null){
            res.json(result);
        }
        else{
            res.status(400).json({
                msg:"error finding trips or may be no trip present"
            });
        }
    }
    catch(err){
        res.status(404).json({
            msg:err
        });
    }
}
export const jointrip = async (req, res) => {
    const tripId = req.params.tripId;
    const userId = req.params.curid; // Assuming authenticated user ID is available in req.params.curid
    try {
      // Fetch the trip by ID
      const trip = await Pool.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      
      // Check if user is already a passenger
      if (trip.passengers.includes(userId)) {
        return res.status(201).json({ message: 'User is already a passenger in this trip' });
      }
  
      // Check if trip is full
      if (trip.PassengersLeft <= 0) {
        return res.status(400).json({ message: 'Trip is already full' });
      }
  
      // Add user to passengers array
      trip.passengers.push(userId);
      trip.PassengersLeft--; // Reduce passengers left count
  
      // Save updated trip details
      await trip.save();
  
      return res.status(200).json({ message: 'Joined trip successfully' });
    } catch (error) {
      console.error('Error joining trip:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  