import express from 'express';
import { listProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectsController';

const router = express.Router();

router.get('/', listProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router; 