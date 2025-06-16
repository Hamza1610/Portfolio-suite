import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/database';
import path from 'path';

// Import routes
import profileRoutes from './routes/profile';
import skillsRoutes from './routes/skills';
import experienceRoutes from './routes/experience';
import educationRoutes from './routes/education';
import projectsRoutes from './routes/projects';
import blogRoutes from './routes/blog';
import uploadRoutes from './routes/uploadRoutes';
import workspaceRoutes from './routes/workspace';
import googleDocsRoutes from './routes/googleDocsRoutes';
import contactRoutes from './routes/contact';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'https://portfolio-suite.onrender.com' // Add your production frontend URL here
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers'
  ],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/google-docs', googleDocsRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 