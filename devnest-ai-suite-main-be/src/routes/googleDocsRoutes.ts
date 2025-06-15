import express from 'express';
import { createDocument } from '../controllers/googleDocsController';

const router = express.Router();

router.post('/create', createDocument);

export default router; 