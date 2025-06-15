import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useProjectMutation, useImageUpload } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';

interface ProjectFormProps {
  project?: {
    _id?: string;
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    images: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    status: 'completed' | 'in-progress' | 'planned';
    order: number;
  };
  onClose: () => void;
  onSave: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSave }) => {
  const { toast } = useToast();
  const projectMutation = useProjectMutation();
  const imageUpload = useImageUpload();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    images: [] as string[],
    featured: false,
    status: 'completed' as 'completed' | 'in-progress' | 'planned',
    order: 0,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        longDescription: project.longDescription || '',
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        images: Array.isArray(project.images) ? project.images : [],
        featured: project.featured || false,
        status: project.status || 'completed',
        order: project.order || 0,
      });
    }
  }, [project]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: previewUrls }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.longDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Title, description, and long description are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      let currentImages = formData.images;

      // Upload new images if any were selected
      if (imageFiles.length > 0) {
        const uploadedImageUrls: string[] = [];
        for (const file of imageFiles) {
          try {
        const formData = new FormData();
            formData.append('image', file);
        const response = await imageUpload.mutateAsync(formData);
            // The response structure is { message: string, url: string }
            if (response && typeof response === 'object' && 'url' in response) {
              uploadedImageUrls.push(response.url);
            } else {
              console.error('Unexpected image upload response structure:', response);
              toast({
                title: "Error",
                description: "Failed to upload image. Unexpected response format.",
                variant: "destructive"
              });
              return;
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            toast({
              title: "Error",
              description: "Failed to upload image. Please try again.",
              variant: "destructive"
            });
            return;
          }
        }
        currentImages = [...currentImages, ...uploadedImageUrls];
      }

      // Prepare project data
      const projectData = {
        _id: project?._id,
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        images: currentImages,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        featured: formData.featured,
        status: formData.status,
        order: formData.order,
      };

      await projectMutation.mutateAsync(projectData);
    onSave();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw] xl:max-w-[800px] overflow-y-auto max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {project ? 'Update your project details below.' : 'Fill in the details to add a new project.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                value={formData.technologies}
                onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                placeholder="e.g., React, Node.js, MongoDB"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter a short description"
              rows={2}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
              placeholder="Enter a detailed description of the project"
              rows={6}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://example.com"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="githubUrl">GitHub Repository URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/repo"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="images">Project Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="cursor-pointer w-full"
            />
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-video">
                  <img
                    src={image}
                    alt={`Project preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'completed' | 'in-progress' | 'planned' }))}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="featured">Featured Project</Label>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
