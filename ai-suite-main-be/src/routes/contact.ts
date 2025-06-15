import express from 'express';
import { sendContactFormEmail } from '../services/emailService';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Send email using the email service
    await sendContactFormEmail(name, email, message);

    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

export default router; 