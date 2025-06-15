import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { error, info } from '../utils/logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

// Handle image upload
export const uploadImage = (req: Request, res: Response) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum size is 5MB' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: err.message });
    }

    // No file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // File was uploaded successfully
    // Use the full URL including the protocol and host
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl
    });
  });
};

// Upload multiple images
export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || (req.files as any[]).length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No files uploaded',
          code: 'NO_FILES',
        },
      });
    }

    const files = (req.files as any[]).map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    info('Multiple images uploaded successfully', { count: files.length });
    
    return res.status(200).json({
      success: true,
      data: files,
    });
  } catch (err) {
    error('Error uploading multiple images', err);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Error uploading images',
        code: 'UPLOAD_ERROR',
      },
    });
  }
};

// Delete an image
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Public ID is required',
          code: 'NO_PUBLIC_ID',
        },
      });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result !== 'ok') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Error deleting image',
          code: 'DELETE_ERROR',
        },
      });
    }

    info('Image deleted successfully', { public_id });
    
    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (err) {
    error('Error deleting image', err);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Error deleting image',
        code: 'DELETE_ERROR',
      },
    });
  }
}; 