import { Request, Response } from 'express';
import Skill, { ISkill } from '../models/Skill';

// List all skills
export const listSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.status(200).json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
};

// Get skill by ID
export const getSkillById = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ message: 'Error fetching skill', error: error.message });
  }
};

// Create a new skill
export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, level, category, order } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    // Validate level
    if (typeof level !== 'number' || level < 0 || level > 100) {
      return res.status(400).json({ message: 'Level must be a number between 0 and 100' });
    }

    // Create new skill
    const newSkill = new Skill({
      name,
      level,
      category,
      order: order || 0
    });

    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    console.error('Error creating skill:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Error creating skill', error: error.message });
  }
};

// Update a skill
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { name, level, category, order } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    // Validate level
    if (typeof level !== 'number' || level < 0 || level > 100) {
      return res.status(400).json({ message: 'Level must be a number between 0 and 100' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        name,
        level,
        category,
        order: order || 0
      },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.status(200).json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Error updating skill', error: error.message });
  }
};

// Delete a skill
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Error deleting skill', error: error.message });
  }
}; 