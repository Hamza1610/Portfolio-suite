# Portfolio Suite

Portfolio Suite is a full-stack web application designed to help users build, manage, and showcase their professional portfolios. It features a modern frontend built with React and Vite, and a robust backend powered by Node.js, Express, and MongoDB. The suite includes tools for managing projects, skills, education, experience, blogs, and AI-powered workspace utilities such as resume and cover letter generation.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **User Authentication**: Secure login and protected admin routes.
- **Profile Management**: Add and update personal information.
- **Projects**: CRUD operations for portfolio projects.
- **Skills**: Manage and display technical and soft skills.
- **Experience & Education**: Add, edit, and remove work and education history.
- **Blog**: Create, edit, and manage blog posts.
- **File Uploads**: Upload images and documents securely.
- **AI Workspace**: Generate resumes, cover letters, and emails using AI.
- **Google Docs Integration**: Export content to Google Docs.
- **Contact Form**: Send messages directly from the portfolio.
- **Admin Dashboard**: Manage all content from a single interface.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

---

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **AI Integration**: Gemini API (Google), OpenAI (optional)
- **Cloud Storage**: Cloudinary
- **Other**: Google Docs API, CORS, Helmet, Morgan, Compression

---

## Project Structure
```
Portfolio suite/
  ai-suite-main/         # Frontend (React + Vite)
  ai-suite-main-be/      # Backend (Node.js + Express)
```

---

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/portfolio-suite.git
cd portfolio-suite
```

### 2. Install Dependencies
#### Frontend
```bash
cd ai-suite-main
npm install
```
#### Backend
```bash
cd ../ai-suite-main-be
npm install
```

### 3. Environment Variables
Create `.env` files in both `ai-suite-main` and `ai-suite-main-be` directories.

#### Frontend (`ai-suite-main/.env`):
```
VITE_API_URL=https://your-backend-url.com/api
```

#### Backend (`ai-suite-main-be/.env`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-url.com
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

---

## Running the Application

### Backend
```bash
cd ai-suite-main-be
npm run dev
```
The backend will start on `http://localhost:5000` by default.

### Frontend
```bash
cd ai-suite-main
npm run dev
```
The frontend will start on `http://localhost:8080` by default.

---

## Deployment
- **Frontend**: Deploy using Vercel, Netlify, or any static hosting provider.
- **Backend**: Deploy using Render, Heroku, or any Node.js hosting provider.
- **Environment variables** must be set in your deployment environment.

---

## API Endpoints
All API endpoints are prefixed with `/api`. Example: `/api/projects`

- **Auth**: `/api/auth`
- **Profile**: `/api/profile`
- **Experience**: `/api/experience`
- **Education**: `/api/education`
- **Skills**: `/api/skills`
- **Projects**: `/api/projects`
- **Blog**: `/api/blog`
- **Upload**: `/api/upload`
- **Workspace (AI)**: `/api/workspace`
- **Google Docs**: `/api/google-docs`
- **Contact**: `/api/contact`

Refer to the backend code for detailed request/response formats.

---

## Contributing
Contributions are welcome! Please open issues and submit pull requests for new features, bug fixes, or documentation improvements.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License
This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgements
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Google Gemini](https://ai.google.dev/gemini-api/docs)
- [OpenAI](https://openai.com/)

---

## Contact
For questions, suggestions, or support, please open an issue or contact the maintainer at your-email@example.com.
