import { Request, Response } from 'express';
import Education, { IEducation } from '../models/Education';

// List all educations
export const listEducations = async (req: Request, res: Response) => {
  try {
    const educations = await Education.find();
    res.status(200).json(educations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching educations', error });
  }
};

// Get education by ID
export const getEducationById = async (req: Request, res: Response) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching education', error });
  }
};

// Create a new education
export const createEducation = async (req: Request, res: Response) => {
  try {
    const newEducation = new Education(req.body);
    await newEducation.save();
    res.status(201).json(newEducation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating education', error });
  }
};

// Update an education
export const updateEducation = async (req: Request, res: Response) => {
  try {
    const updatedEducation = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEducation) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.status(200).json(updatedEducation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating education', error });
  }
};

// Delete an education
export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const deletedEducation = await Education.findByIdAndDelete(req.params.id);
    if (!deletedEducation) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.status(200).json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting education', error });
  }
}; 