import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/hideout',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const place=mongoose.model('places',{
    user_obj_id: mongoose.Schema.Types.ObjectId,
    place_name: String,
    fileid: mongoose.Schema.Types.ObjectId,
    coordid:mongoose.Schema.Types.ObjectId,
    
    story: String,
    likes: Number,
    type: String,
});
 export default place;