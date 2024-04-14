import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/hideout',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const visited_places=mongoose.model('visited_places',{
    user_obj_id: mongoose.Schema.Types.ObjectId,
    places_obj_id: mongoose.Schema.Types.ObjectId,
});
export default visited_places;