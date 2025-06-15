import { Request, Response } from 'express';
import GoogleDocsService from '../services/googleDocsService';

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { content, title } = req.body;

    if (!content || !title) {
      return res.status(400).json({
        success: false,
        message: 'Content and title are required'
      });
    }

    const result = await GoogleDocsService.getInstance().createDocumentFromMarkdown(content, title);
    res.json(result);
  } catch (error: any) {
    console.error('Error in createDocument:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create Google Doc'
    });
  }
}; 