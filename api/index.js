import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import cors from "cors";
import path from 'path';
import placeRouter from "./routes/places.rout.js"
import bodyparser from 'body-parser';

import {upload_place} from './controllers/user_places.controller.js';
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow including cookies in requests (if applicable)
}));
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/places',placeRouter);


ect-DTI/api/uploads"));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "C:/Users/shubh kamra/hideout_proj_daa/hideout-project-DTI/api/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
})

app.post('/api/upload', upload.single('image'), upload_place);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});
