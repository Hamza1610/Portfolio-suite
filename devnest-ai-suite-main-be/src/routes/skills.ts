import express from 'express';
import { listSkills, getSkillById, createSkill, updateSkill, deleteSkill } from '../controllers/skillsController';

const router = express.Router();

router.get('/', listSkills);
router.get('/:id', getSkillById);
router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router; 