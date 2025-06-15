import express from 'express';
import {
  generateEmailHandler,
  generateResumeHandler,
  generateCoverLetterHandler,
  refineContentHandler
} from '../controllers/workspaceController';

const router = express.Router();

router.post('/email', generateEmailHandler);
router.post('/resume', generateResumeHandler);
router.post('/cover-letter', generateCoverLetterHandler);
router.post('/refine', refineContentHandler);

export default router; 