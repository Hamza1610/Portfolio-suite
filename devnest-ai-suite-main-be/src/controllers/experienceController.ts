import { Request, Response } from 'express';
import Experience, { IExperience } from '../models/Experience';

// List all experiences
export const listExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find();
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiences', error });
  }
};

// Get experience by ID
export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experience', error });
  }
};

// Create a new experience
export const createExperience = async (req: Request, res: Response) => {
  try {
    const newExperience = new Experience(req.body);
    await newExperience.save();
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({ message: 'Error creating experience', error });
  }
};

// Update an experience
export const updateExperience = async (req: Request, res: Response) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json(updatedExperience);
  } catch (error) {
    res.status(500).json({ message: 'Error updating experience', error });
  }
};

// Delete an experience
export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting experience', error });
  }
}; 