import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

// Upload a single image to Cloudinary
export const uploadImage = async (file: Express.Multer.File): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as UploadApiResponse);
      }
    });
  });
};

// Upload multiple images to Cloudinary
export const uploadMultipleImages = async (files: Express.Multer.File[]): Promise<UploadApiResponse[]> => {
  const uploadPromises = files.map(file => uploadImage(file));
  return Promise.all(uploadPromises);
};

// Delete an image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}; 