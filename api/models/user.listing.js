import mongoose from 'mongoose';

const userListingSchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        photos: {
            type: Array,
            required: true,
        },
        music: {
            type: Array,
            required: true,
        },
    }
);

const UserListing = mongoose.model('UserListing', userListingSchema);

export default UserListing;