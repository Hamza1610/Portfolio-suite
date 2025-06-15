import { Request, Response } from 'express';
import { generateEmail, generateResume, generateCoverLetter, refineContent } from '../services/workspaceService';

export const generateEmailHandler = async (req: Request, res: Response) => {
  try {
    const email = await generateEmail(req.body);
    res.json({ email });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to generate email', error: err.message });
  }
};

export const generateResumeHandler = async (req: Request, res: Response) => {
  try {
    const resume = await generateResume(req.body);
    res.json({ resume });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to generate resume', error: err.message });
  }
};

export const generateCoverLetterHandler = async (req: Request, res: Response) => {
  try {
    const coverLetter = await generateCoverLetter(req.body);
    res.json({ coverLetter });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to generate cover letter', error: err.message });
  }
};

export const refineContentHandler = async (req: Request, res: Response) => {
  try {
    const { content, type, improvements } = req.body;
    const refined = await refineContent(content, type, improvements);
    res.json({ content: refined });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to refine content', error: err.message });
  }
}; 