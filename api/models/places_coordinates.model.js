import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/hideout',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const placesCoordinatesSchema = new mongoose.Schema({
    user_obj_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fileid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
    }
});

// Ensure an index on the location field for efficient geospatial queries
placesCoordinatesSchema.index({ location: '2dsphere' });

const coordinatemodel = mongoose.model('places_coordinates', placesCoordinatesSchema);

export default coordinatemodel
