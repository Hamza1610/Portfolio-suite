# Complete Portfolio Backend Development Specification

## Project Overview
This document provides comprehensive specifications for developing a full-stack portfolio backend system with MongoDB, Node.js/Express, Cloudinary integration, and Gemini AI capabilities. The backend will serve a React frontend and provide complete CRUD operations for portfolio management.

## 1. Database Schema (MongoDB)

### User/Profile Schema
```typescript
interface Profile {
  _id: ObjectId;
  name: string;
  email: string;
  title: string;
  bio: string;
  location: string;
  avatar?: string; // Cloudinary URL
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Skills Schema
```typescript
interface Skill {
  _id: ObjectId;
  name: string;
  level: number; // 0-100
  category: string; // Frontend, Backend, Database, etc.
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Experience Schema
```typescript
interface Experience {
  _id: ObjectId;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date; // null for current position
  description: string;
  technologies: string[];
  achievements: string[];
  companyLogo?: string; // Cloudinary URL
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Education Schema
```typescript
interface Education {
  _id: ObjectId;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date;
  grade?: string;
  description?: string;
  logo?: string; // Cloudinary URL
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Projects Schema
```typescript
interface Project {
  _id: ObjectId;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  images: string[]; // Cloudinary URLs
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Blog Posts Schema
```typescript
interface BlogPost {
  _id: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML content
  tags: string[];
  featuredImage?: string; // Cloudinary URL
  published: boolean;
  publishedAt?: Date;
  readTime: number; // in minutes
  views: number;
  likes: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 2. Complete API Endpoints Structure

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
POST /api/auth/refresh
```

### Profile Management Endpoints
```
GET /api/profile
PUT /api/profile
POST /api/profile/avatar (with Cloudinary upload)
DELETE /api/profile/avatar
```

### Skills Endpoints
```
GET /api/skills
GET /api/skills/:id
POST /api/skills
PUT /api/skills/:id
DELETE /api/skills/:id
PUT /api/skills/reorder (bulk update for drag-drop)
```

### Experience Endpoints
```
GET /api/experience
GET /api/experience/:id
POST /api/experience
PUT /api/experience/:id
DELETE /api/experience/:id
PUT /api/experience/reorder
POST /api/experience/:id/logo (Cloudinary upload)
```

### Education Endpoints
```
GET /api/education
GET /api/education/:id
POST /api/education
PUT /api/education/:id
DELETE /api/education/:id
PUT /api/education/reorder
POST /api/education/:id/logo (Cloudinary upload)
```

### Projects Endpoints
```
GET /api/projects
GET /api/projects/featured
GET /api/projects/:id
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
PUT /api/projects/reorder
POST /api/projects/:id/images (Cloudinary upload)
DELETE /api/projects/:id/images/:imageId
PUT /api/projects/:id/featured (toggle featured status)
```

### Blog Endpoints
```
GET /api/blog/posts
GET /api/blog/posts/published
GET /api/blog/posts/:slug
GET /api/blog/posts/:id
POST /api/blog/posts
PUT /api/blog/posts/:id
DELETE /api/blog/posts/:id
POST /api/blog/posts/:id/publish
POST /api/blog/posts/:id/unpublish
POST /api/blog/posts/:id/like
POST /api/blog/generate (Gemini AI integration)
POST /api/blog/posts/:id/featured-image (Cloudinary upload)
```

### File Upload Endpoints
```
POST /api/upload/image (Cloudinary)
DELETE /api/upload/image/:publicId
POST /api/upload/multiple (multiple images)
```

### Analytics Endpoints
```
GET /api/analytics/dashboard
GET /api/analytics/blog-views
GET /api/analytics/project-views
POST /api/analytics/track-view
```

## 3. Environment Variables Configuration

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio
MONGODB_DB_NAME=portfolio

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Email Configuration (for contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
```

## 4. Required Dependencies

### Production Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.6.0",
  "cloudinary": "^1.41.0",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "dotenv": "^16.3.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "express-rate-limit": "^6.10.0",
  "express-validator": "^7.0.1",
  "nodemailer": "^6.9.7",
  "@google/generative-ai": "^0.2.1",
  "slugify": "^1.6.6",
  "compression": "^1.7.4",
  "morgan": "^1.10.0"
}
```

### Development Dependencies
```json
{
  "@types/express": "^4.17.17",
  "@types/node": "^20.8.0",
  "@types/cors": "^2.8.14",
  "@types/jsonwebtoken": "^9.0.3",
  "@types/bcryptjs": "^2.4.4",
  "@types/multer": "^1.4.8",
  "@types/nodemailer": "^6.4.11",
  "typescript": "^5.2.2",
  "nodemon": "^3.0.1",
  "ts-node": "^10.9.1",
  "@typescript-eslint/eslint-plugin": "^6.7.4",
  "@typescript-eslint/parser": "^6.7.4",
  "eslint": "^8.50.0",
  "prettier": "^3.0.3"
}
```

## 5. Project Structure
```
portfolio-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── cloudinary.ts
│   │   └── gemini.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── profileController.ts
│   │   ├── skillsController.ts
│   │   ├── experienceController.ts
│   │   ├── educationController.ts
│   │   ├── projectsController.ts
│   │   ├── blogController.ts
│   │   └── uploadController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── upload.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimit.ts
│   ├── models/
│   │   ├── Profile.ts
│   │   ├── Skill.ts
│   │   ├── Experience.ts
│   │   ├── Education.ts
│   │   ├── Project.ts
│   │   └── BlogPost.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   ├── education.ts
│   │   ├── projects.ts
│   │   ├── blog.ts
│   │   └── upload.ts
│   ├── services/
│   │   ├── cloudinaryService.ts
│   │   ├── geminiService.ts
│   │   ├── emailService.ts
│   │   └── analyticsService.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

## 6. Implementation Steps

### Step 1: Project Setup
```bash
mkdir portfolio-backend
cd portfolio-backend
npm init -y
npm install express mongoose cloudinary multer cors helmet dotenv jsonwebtoken bcryptjs express-rate-limit express-validator nodemailer @google/generative-ai slugify compression morgan
npm install -D @types/express @types/node @types/cors @types/jsonwebtoken @types/bcryptjs @types/multer @types/nodemailer typescript nodemon ts-node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier
```

### Step 2: TypeScript Configuration
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 3: Database Connection Setup
Create MongoDB connection with proper error handling and connection pooling.

### Step 4: Mongoose Models Implementation
Implement all schemas with proper validation, indexes, and middleware hooks.

### Step 5: Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Refresh token mechanism
- Protected route middleware

### Step 6: Cloudinary Integration
- Image upload handling
- Image optimization
- Automatic resizing
- Secure URL generation

### Step 7: Gemini AI Integration
- Content generation for blog posts
- SEO optimization
- Description enhancement
- Tag suggestions

### Step 8: API Controllers Implementation
Full CRUD operations for all entities with proper error handling and validation.

### Step 9: Middleware Implementation
- Authentication middleware
- Validation middleware
- File upload middleware
- Error handling middleware
- Rate limiting

### Step 10: Routes Configuration
RESTful API routes with proper HTTP methods and status codes.

## 7. Key Features Implementation Details

### Authentication Features
- Secure login/logout
- JWT token management
- Password reset functionality
- Session management
- Role-based access control

### Cloudinary Integration Features
- Automatic image optimization
- Multiple image uploads
- Image deletion
- Secure URL generation
- Transform parameters
- Backup and recovery

### Gemini AI Integration Features
- Blog content generation
- SEO meta tag generation
- Content improvement suggestions
- Keyword extraction
- Readability analysis

### Database Features
- Connection pooling
- Automatic reconnection
- Data validation
- Indexing for performance
- Backup strategies

### Security Features
- CORS configuration
- Helmet for security headers
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

### Performance Features
- Response compression
- Caching strategies
- Database query optimization
- Image optimization
- CDN integration

## 8. Error Handling Strategy

### Error Types
- Validation errors
- Authentication errors
- Database errors
- File upload errors
- Third-party service errors

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
    statusCode: number;
  };
}
```

### Success Response Format
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## 9. Deployment Considerations

### Environment Setup
- Production environment variables
- Database connection strings
- SSL certificates
- Domain configuration

### Deployment Platforms
- **Vercel**: Serverless functions
- **Railway**: Full-stack deployment
- **Render**: Container deployment
- **DigitalOcean**: VPS deployment
- **AWS**: EC2 or Lambda

### Database Options
- **MongoDB Atlas**: Cloud database
- **Local MongoDB**: Development
- **DigitalOcean MongoDB**: Managed database

## 10. Frontend Integration

### API Client Setup
Configure frontend to communicate with backend APIs using fetch or axios.

### Authentication Integration
- Login/logout functionality
- Protected routes
- Token management
- Automatic token refresh

### File Upload Integration
- Image upload components
- Progress indicators
- Error handling
- Preview functionality

### Real-time Features
- Live content updates
- Form validation
- Auto-save functionality
- Optimistic updates

## 11. Testing Strategy

### Unit Tests
- Controller functions
- Service functions
- Utility functions
- Validation logic

### Integration Tests
- API endpoints
- Database operations
- Third-party integrations
- Authentication flows

### Testing Tools
- Jest for unit testing
- Supertest for API testing
- MongoDB Memory Server for testing
- Mock services for third-party APIs

## 12. Monitoring and Logging

### Logging Strategy
- Request/response logging
- Error logging
- Performance monitoring
- Security event logging

### Monitoring Tools
- Application performance monitoring
- Database performance monitoring
- Error tracking
- Uptime monitoring

## 13. Backup and Recovery

### Database Backup
- Automated daily backups
- Point-in-time recovery
- Backup verification
- Disaster recovery plan

### File Backup
- Cloudinary automatic backup
- Local backup strategies
- Version control
- Recovery procedures

This comprehensive specification provides all the necessary details for implementing a complete portfolio backend system with modern features, security, and scalability considerations.