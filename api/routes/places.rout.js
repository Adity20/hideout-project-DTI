import mongoose, { model } from "mongoose";
import express from "express";
import { spawn } from 'child_process';
import path from 'path';
import file_storages from '../models/file_storage.model.js'
import place_model from '../models/place.model.js'


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
// string password="password123";
router.get('/user-rec/:id/:name',async(req,res)=>{
    try{
        const cppExecutable = path.join('C:/Users/shubh kamra/source/repos/CMakeProject4/out/build/x64-debug/CMakeProject.exe');
        const child = spawn(cppExecutable)
        let processData = '';
        console.log(req.params.id);
        console.log(req.params.name);
        child.stdin.write(`${req.params.id}\n`);
        child.stdin.write(`${req.params.name}\n`);
        child.stdout.on('data', (data) => {
            processData += data.toString(); // Append data to accumulate
        });
        child.on('close', async () => {
            // Remove '\r' characters from the accumulated data
            processData = processData.replace(/\r/g, '');
        
            // Trim trailing whitespace, including newline characters, before splitting
            processData = processData.trim();
        
            // Split accumulated data on newline characters
            const dataLines = processData.split('\n');
            console.log(dataLines);
            // Optionally prettify JSON with null and 2
        
            // Write JSON data to file
            // fs.writeFile('output.json', jsonData, (err) => {
            //     if (err) {
            //         console.error('Error writing to file:', err);
            //         return;
            //     }
            let dataarr=[];
            for (const element of dataLines){
                const specificObjectId =new mongoose.Types.ObjectId(element)
                const rec=await place_model.aggregate([{
                    $lookup:{
                        from: 'file_storages',
                        localField: 'fileid',
                        foreignField: '_id',
                        as: 'file',
                    },
                },{
                    $match:{_id:specificObjectId},
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

                }]

                );
                
                dataarr.push(rec);

            }
            let flattenedArray = [].concat(...dataarr);
            // console.log("----------------");
            // console.log(flattenedArray);
            res.json(flattenedArray);
            });
        
        child.on('error', (err) => {
            console.error('Error executing child process:', err);
        });
        
        child.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
        });
    }
    catch(Err){
        res.status(404).json({
            status:"fail",
            message:"igot a cha",
        });
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

export default router;