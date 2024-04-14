import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/hideout',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const places_coordinates = new mongoose.Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'], // Only 'Point' type is allowed
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: true
        }
    },
    places_obj_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'places',
        required:true,
    }

});

// Ensure an index on the location field for efficient geospatial queries
places_coordinates.index({ location: '2dsphere' });

const coordinatemodel = mongoose.model('places_coordinates', places_coordinates);

export default coordinatemodel
