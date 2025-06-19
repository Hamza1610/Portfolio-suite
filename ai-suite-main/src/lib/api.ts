import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL  || 'http://localhost:5000/api';



export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Skills API calls
export const skillsApi = {
  getSkills: () => api.get('/skills'),
  getSkill: (id: string) => api.get(`/skills/${id}`),
  createSkill: (data: any) => api.post('/skills', data),
  updateSkill: (id: string, data: any) => api.put(`/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/skills/${id}`),
};

// Projects API calls
export const projectsApi = {
  getProjects: () => api.get('/projects'),
  getProject: (id: string) => api.get(`/projects/${id}`),
  createProject: (data: any) => api.post('/projects', data),
  updateProject: (id: string, data: any) => api.put(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
};

// Blog API calls
export const blogApi = {
  getBlogPosts: () => api.get('/blog'),
  getBlogPost: (id: string) => api.get(`/blog/${id}`),
  createBlogPost: (data: any) => api.post('/blog', data),
  updateBlogPost: (id: string, data: any) => api.put(`/blog/${id}`, data),
  deleteBlogPost: (id: string) => api.delete(`/blog/${id}`),
  
  // AI-powered blog functions
  generateBlogContent: (data: { topic: string; tone: string; length: string; keywords?: string[] }) =>
    api.post('/blog/ai/generate', data),
  refineBlogContent: (data: { content: string; tone: string; improvements?: string[] }) =>
    api.post('/blog/ai/refine', data),
  generateMetaTags: (data: { title: string; content: string }) =>
    api.post('/blog/ai/meta-tags', data),
};

// Upload API calls
export const uploadApi = {
  uploadImage: (formData: FormData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  uploadMultipleImages: (formData: FormData) => api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteImage: (id: string) => api.delete(`/upload/image/${id}`),
};

// Education API
export const educationApi = {
  getEducation: async () => {
    console.log('Fetching education data...');
    try {
      const response = await api.get('/education');
      console.log('Education API response:', response);
      return response;
    } catch (error) {
      console.error('Education API error:', error);
      throw error;
    }
  },
  getEducationById: (id: string) => api.get(`/education/${id}`),
  createEducation: (data: any) => api.post('/education', data),
  updateEducation: (id: string, data: any) => api.put(`/education/${id}`, data),
  deleteEducation: (id: string) => api.delete(`/education/${id}`),
};

// Experience API calls
export const experienceApi = {
  getExperiences: () => api.get('/experience'),
  getExperience: (id: string) => api.get(`/experience/${id}`),
  createExperience: (data: any) => api.post('/experience', data),
  updateExperience: (id: string, data: any) => api.put(`/experience/${id}`, data),
  deleteExperience: (id: string) => api.delete(`/experience/${id}`),
};

// Workspace API calls
export const workspaceApi = {
  generateEmail: (data: {
    category: string;
    purpose: string;
    recipientName?: string;
    additionalContext?: string;
  }) => api.post('/workspace/email', data),

  generateResume: (data: {
    roleTitle: string;
    targetCompany: string;
    jobDescription?: string;
    personalHighlights?: string;
  }) => api.post('/workspace/resume', data),

  generateCoverLetter: (data: {
    roleTitle: string;
    targetCompany: string;
    hiringManager?: string;
    jobDescription?: string;
    personalMotivation?: string;
  }) => api.post('/workspace/cover-letter', data),

  refineContent: (data: {
    content: string;
    type: 'email' | 'resume' | 'cover-letter';
    improvements?: string[];
  }) => api.post('/workspace/refine', data),

  createGoogleDoc: async (data: { content: string; title: string }) => {
    return api.post('/google-docs/create', data);
  },
};

// Contact API
export const contactApi = {
  sendMessage: (data: { name: string; email: string; subject: string; message: string }) => 
    api.post('/contact', data).then(res => res.data),
};

export default api; 