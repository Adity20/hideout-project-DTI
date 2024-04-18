import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/hideout', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const poolSchema = new mongoose.Schema({
    user_obj_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    StartDate: {
        type: Date,
        required: true,
    },
    EndDate: {
        type: Date,
        required: true,
    },
    Origin: {
        type: String,
        required: true,
    },
    OriginCoordinates: {
        type: {
            type: String,
            enum: ['Point'], // Only 'Point' type is allowed
        
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            
        }
    },
    Destination: {
        type: String,
        required: true,
    },
    DestinationCoordinates: {
        type: {
            type: String,
            enum: ['Point'], // Only 'Point' type is allowed
            
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
           
        },
    },
    passengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' // Assuming you have a User model
    }],
    Budget: {
        type: Number,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    MaxCapacity:{
        type:Number,
        required:true,
    },
    PassengersLeft:{
        type:Number,
        required:true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index origin and destination fields for geospatial queries
poolSchema.index({ OriginCoordinates: '2dsphere', DestinationCoordinates: '2dsphere' });

const Pool = mongoose.model('Pool', poolSchema);

export default Pool;
