import express from 'express';
import { listEducations, getEducationById, createEducation, updateEducation, deleteEducation } from '../controllers/educationController';

const router = express.Router();

router.get('/', listEducations);
router.get('/:id', getEducationById);
router.post('/', createEducation);
router.put('/:id', updateEducation);
router.delete('/:id', deleteEducation);

export default router; 