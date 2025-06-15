import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if credentials match environment variables
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Generate JWT token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router; 