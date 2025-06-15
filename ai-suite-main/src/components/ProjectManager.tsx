import React, { useState } from 'react';
import { useProjects, useProjectMutation, useDeleteProject, useImageUpload } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Project {
  _id: string;
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
}

const ProjectManager = () => {
  const { data: projects, isLoading, error } = useProjects();
  const { mutate: mutateProject } = useProjectMutation();
  const deleteProjectMutation = useDeleteProject();
  const imageUpload = useImageUpload();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    longDescription: '',
    technologies: [],
    images: [],
    liveUrl: '',
    githubUrl: '',
    featured: false,
    status: 'completed',
    order: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const values = e.target.value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [e.target.name]: values }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Upload images immediately
      const uploadedUrls: string[] = [];
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          const response = await imageUpload.mutateAsync(formData);
          if (response && response.url) {
            uploadedUrls.push(response.url);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive"
          });
        }
      }
      
      // Update form data with new image URLs
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      technologies: [],
      images: [],
      liveUrl: '',
      githubUrl: '',
      featured: false,
      status: 'completed',
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare project data
      const projectData = {
        _id: editingProject?._id,
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        technologies: formData.technologies,
        images: formData.images,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        featured: formData.featured,
        status: formData.status,
        order: formData.order,
      };

      await mutateProject(projectData);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      _id: project._id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      technologies: project.technologies,
      images: project.images,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured,
      status: project.status,
      order: project.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete._id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setProjectToDelete(null);
          toast({
            title: "Success",
            description: "Project deleted successfully",
          });
        },
        onError: (error: any) => {
          console.error('Delete failed:', error);
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to delete project",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      technologies: [],
      images: [],
      liveUrl: '',
      githubUrl: '',
      featured: false,
      status: 'completed',
      order: 0,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Projects</h2>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Projects</h2>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load projects</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-6">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project._id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={project.featured ? "default" : "secondary"}>
                        {project.featured ? "Featured" : "Regular"}
                      </Badge>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(project)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="technologies">Technologies (one per line)</Label>
              <Textarea
                id="technologies"
                name="technologies"
                value={formData.technologies?.join('\n')}
                onChange={handleArrayInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="images">Project Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formData.images?.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Project preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="githubUrl">GitHub Repository URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured">Featured Project</Label>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Project['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProject ? 'Update' : 'Add'} Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectManager; 