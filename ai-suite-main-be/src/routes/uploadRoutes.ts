import express from 'express';
import { uploadImage } from '../controllers/uploadController';

const router = express.Router();

router.post('/', uploadImage);

export default router; 