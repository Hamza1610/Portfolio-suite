import { Request, Response } from 'express';
import Profile, { IProfile } from '../models/Profile';

// List all profiles
export const listProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profiles', error });
  }
};

// Get profile by ID
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// Create a new profile
export const createProfile = async (req: Request, res: Response) => {
  try {
    const newProfile = new Profile(req.body);
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error creating profile', error });
  }
};

// Update a profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

// Delete a profile
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error });
  }
}; 