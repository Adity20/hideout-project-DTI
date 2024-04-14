import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/hideout',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const file_storage=mongoose.model('file_storages',{
    filepath: String,
    filename: String,
});
export default file_storage;