import express from 'express';
import { listExperiences, getExperienceById, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController';

const router = express.Router();

router.get('/', listExperiences);
router.get('/:id', getExperienceById);
router.post('/', createExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router; 