import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController';
import upload from '../middleware/upload';
import { handleUploadError } from '../middleware/upload';

const router = express.Router();

// Upload a single image
router.post('/image', upload.single('image'), handleUploadError, uploadImage);

// Upload multiple images
router.post('/multiple', upload.array('images', 5), handleUploadError, uploadMultipleImages);

// Delete an image
router.delete('/image/:public_id', deleteImage);

export default router; 