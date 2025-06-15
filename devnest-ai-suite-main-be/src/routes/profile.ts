import express from 'express';
import { listProfiles, getProfileById, createProfile, updateProfile, deleteProfile } from '../controllers/profileController';

const router = express.Router();

router.get('/', listProfiles);
router.get('/:id', getProfileById);
router.post('/', createProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

export default router; 