import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi, projectsApi, blogApi, uploadApi, educationApi, experienceApi, contactApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { api } from '@/lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Contact API hook
export const useContactForm = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: { name: string; email: string; subject: string; message: string }) => 
      contactApi.sendMessage(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message sent successfully. I'll get back to you soon.",
      });
    },
    onError: (error: any) => {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    },
  });
};

// Skills hooks
export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.get('/skills');
      return response.data;
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/skills/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};

export const useSkillMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => {
      return data._id 
        ? skillsApi.updateSkill(data._id, data)
        : skillsApi.createSkill(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({
        title: "Success",
        description: "Skill updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      });
    },
  });
};

// Project API endpoints
export const projectApi = {
  getProjects: () => api.get('/projects').then(res => res.data),
  createProject: (data: any) => api.post('/projects', data).then(res => res.data),
  updateProject: (id: string, data: any) => api.put(`/projects/${id}`, data).then(res => res.data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`).then(res => res.data),
};

// Project hooks
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getProjects,
  });
};

export const useProjectMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => {
      console.log('Project mutation data:', data);
      
      // Create a new object without _id for new projects
      const projectData = { ...data };
      if (!data._id) {
        delete projectData._id;
      }

      // Ensure required fields have default values
      if (!projectData.status) {
        projectData.status = 'completed';
      }
      if (typeof projectData.order !== 'number') {
        projectData.order = 0;
      }

      if (data._id) {
        console.log('Updating project with ID:', data._id);
        return projectApi.updateProject(data._id, projectData);
      }
      console.log('Creating new project');
      return projectApi.createProject(projectData);
    },
    onSuccess: (data, variables) => {
      console.log('Project mutation success:', data);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: variables._id ? "Project updated successfully" : "Project added successfully",
      });
    },
    onError: (error: any) => {
      console.error('Project mutation error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save project",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => {
      console.log('Deleting project with ID:', id);
      return projectApi.deleteProject(id);
    },
    onSuccess: () => {
      console.log('Project deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Project deletion error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });
};

// Blog hooks
export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => blogApi.getBlogPosts().then(res => res.data),
  });
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => blogApi.getBlogPost(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useBlogPostMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => {
      return data.id 
        ? blogApi.updateBlogPost(data.id, data)
        : blogApi.createBlogPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => blogApi.deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });
};

// Upload hooks
export const useImageUpload = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};

// Education hooks
export const useEducation = () => {
  return useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const response = await educationApi.getEducation();
      return response.data;
    },
  });
};

export const useEducationMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => {
      console.log('Education mutation data:', data);
      if (data._id) {
        console.log('Updating education with ID:', data._id);
        return educationApi.updateEducation(data._id, data);
      }
      console.log('Creating new education');
      return educationApi.createEducation(data);
    },
    onSuccess: (data, variables) => {
      console.log('Education mutation success:', data);
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast({
        title: "Success",
        description: variables._id ? "Education updated successfully" : "Education added successfully",
      });
    },
    onError: (error: any) => {
      console.error('Education mutation error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save education",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Starting delete education mutation with ID:', id);
      console.log('API URL:', API_URL);
      console.log('Full delete URL:', `${API_URL}/education/${id}`);
      
      try {
        console.log('Making delete request...');
        const response = await educationApi.deleteEducation(id);
        console.log('Delete response:', response);
        return response.data;
      } catch (error: any) {
        console.error('Delete education error:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          config: error.config
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Delete successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast({
        title: "Success",
        description: "Education deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete education",
        variant: "destructive",
      });
    },
  });
};

// Experience hooks
export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await api.get('/experience');
      return response.data;
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Starting delete experience mutation with ID:', id);
      console.log('API URL:', API_URL);
      console.log('Full delete URL:', `${API_URL}/experience/${id}`);
      
      try {
        console.log('Making delete request...');
        const response = await experienceApi.deleteExperience(id);
        console.log('Delete response:', response);
        return response.data;
      } catch (error: any) {
        console.error('Delete experience error:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          config: error.config
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Delete successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete experience",
        variant: "destructive",
      });
    },
  });
};

export const useExperienceMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => {
      return data._id
        ? experienceApi.updateExperience(data._id, data)
        : experienceApi.createExperience(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast({
        title: "Success",
        description: "Experience updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update experience",
        variant: "destructive",
      });
    },
  });
}; 