import express from 'express';
import { getalltrips,getonetrip,jointrip } from '../controllers/pool.controller.js';

const router=express.Router();

router.get('/',getalltrips);
router.get('/getone/:id',getonetrip);
router.post('/:tripId/join/:curid',jointrip );

export default router;