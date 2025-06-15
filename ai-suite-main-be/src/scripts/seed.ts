import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../models/Profile';
import Skill from '../models/Skill';
import Experience from '../models/Experience';
import Education from '../models/Education';
import Project from '../models/Project';
import BlogPost from '../models/BlogPost';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

// Sample data
const profileData = {
  name: 'John Doe',
  email: 'john@example.com',
  title: 'Full Stack Developer',
  bio: 'Passionate developer with expertise in modern web technologies',
  location: 'New York, USA',
  socialLinks: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    website: 'https://johndoe.com'
  },
  isAvailable: true
};

const skillsData = [
  {
    name: 'React',
    level: 90,
    category: 'Frontend',
    icon: 'react',
    order: 1
  },
  {
    name: 'Node.js',
    level: 85,
    category: 'Backend',
    icon: 'nodejs',
    order: 2
  },
  {
    name: 'MongoDB',
    level: 80,
    category: 'Database',
    icon: 'mongodb',
    order: 3
  }
];

const experienceData = [
  {
    company: 'Tech Corp',
    position: 'Senior Developer',
    startDate: new Date('2020-01-01'),
    endDate: new Date('2023-12-31'),
    description: 'Led development of enterprise applications',
    technologies: ['React', 'Node.js', 'MongoDB'],
    achievements: ['Reduced load time by 50%', 'Implemented CI/CD pipeline'],
    order: 1
  },
  {
    company: 'StartUp Inc',
    position: 'Full Stack Developer',
    startDate: new Date('2018-01-01'),
    endDate: new Date('2019-12-31'),
    description: 'Developed and maintained web applications',
    technologies: ['Vue.js', 'Express', 'PostgreSQL'],
    achievements: ['Built MVP in 3 months', 'Increased user engagement by 200%'],
    order: 2
  }
];

const educationData = [
  {
    institution: 'University of Technology',
    degree: 'Master of Science',
    field: 'Computer Science',
    startDate: new Date('2016-09-01'),
    endDate: new Date('2018-06-30'),
    grade: 'A',
    description: 'Specialized in Software Engineering',
    order: 1
  },
  {
    institution: 'State University',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: new Date('2012-09-01'),
    endDate: new Date('2016-06-30'),
    grade: 'A+',
    description: 'Dean\'s List, Computer Science Department',
    order: 2
  }
];

const projectsData = [
  {
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform',
    longDescription: 'Built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    images: ['https://example.com/image1.jpg'],
    liveUrl: 'https://ecommerce-demo.com',
    githubUrl: 'https://github.com/johndoe/ecommerce',
    featured: true,
    status: 'completed',
    order: 1
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application',
    longDescription: 'Real-time task management with team collaboration features. Built with Vue.js and Firebase.',
    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    images: ['https://example.com/image2.jpg'],
    liveUrl: 'https://task-manager-demo.com',
    githubUrl: 'https://github.com/johndoe/task-manager',
    featured: true,
    status: 'completed',
    order: 2
  }
];

const blogPostsData = [
  {
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    excerpt: 'A comprehensive guide to React for beginners',
    content: 'Detailed content about React basics...',
    tags: ['React', 'JavaScript', 'Web Development'],
    published: true,
    publishedAt: new Date(),
    readTime: 10,
    views: 0,
    likes: 0,
    seo: {
      metaTitle: 'Getting Started with React - Complete Guide',
      metaDescription: 'Learn React from scratch with this comprehensive guide',
      keywords: ['React', 'JavaScript', 'Web Development', 'Frontend']
    }
  },
  {
    title: 'Building REST APIs with Node.js',
    slug: 'building-rest-apis-with-nodejs',
    excerpt: 'Learn how to build scalable REST APIs using Node.js',
    content: 'Detailed content about Node.js and REST APIs...',
    tags: ['Node.js', 'REST API', 'Backend'],
    published: true,
    publishedAt: new Date(),
    readTime: 15,
    views: 0,
    likes: 0,
    seo: {
      metaTitle: 'Building REST APIs with Node.js - Complete Guide',
      metaDescription: 'Master REST API development with Node.js',
      keywords: ['Node.js', 'REST API', 'Backend', 'JavaScript']
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Profile.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Project.deleteMany({}),
      BlogPost.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert new data
    await Promise.all([
      Profile.create(profileData),
      Skill.insertMany(skillsData),
      Experience.insertMany(experienceData),
      Education.insertMany(educationData),
      Project.insertMany(projectsData),
      BlogPost.insertMany(blogPostsData)
    ]);
    console.log('Database seeded successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 