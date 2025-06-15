import React, { useState } from 'react';
import { useExperiences, useExperienceMutation, useDeleteExperience } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  achievements: string[];
  companyLogo?: string;
  order: number;
}

const ExperienceManager = () => {
  const { data: experiences, isLoading } = useExperiences();
  const { mutate: mutateExperience } = useExperienceMutation();
  const deleteExperienceMutation = useDeleteExperience();
  const { toast } = useToast();
  
  console.log('Component mounted, deleteExperienceMutation:', deleteExperienceMutation);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: [],
    achievements: [],
    order: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'technologies' | 'achievements') => {
    const values = e.target.value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutateExperience(formData, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setFormData({
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          technologies: [],
          achievements: [],
          order: 0
        });
        toast({
          title: "Success",
          description: editingExperience ? "Experience updated successfully" : "Experience added successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save experience",
          variant: "destructive",
        });
      }
    });
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData(experience);
    setIsDialogOpen(true);
  };

  const handleDelete = (experience: Experience) => {
    console.log('1. Delete button clicked');
    console.log('2. Experience to delete:', experience);
    setExperienceToDelete(experience);
    setDeleteDialogOpen(true);
    console.log('3. Delete dialog opened');
  };

  const confirmDelete = () => {
    console.log('4. Confirm delete clicked');
    if (experienceToDelete) {
      console.log('5. Experience to delete exists:', experienceToDelete);
      console.log('6. Experience ID to delete:', experienceToDelete._id);
      
      console.log('7. Calling delete mutation...');
      deleteExperienceMutation.mutate(experienceToDelete._id, {
        onSuccess: (data) => {
          console.log('8. Delete successful:', data);
          setDeleteDialogOpen(false);
          setExperienceToDelete(null);
          toast({
            title: "Success",
            description: "Experience deleted successfully",
          });
        },
        onError: (error: any) => {
          console.error('9. Delete failed:', error);
          console.error('10. Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to delete experience",
            variant: "destructive",
          });
        }
      });
    } else {
      console.log('5. No experience to delete!');
    }
  };

  const handleAddNew = () => {
    setEditingExperience(null);
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: [],
      achievements: [],
      order: experiences?.length || 0
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading experiences...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          <span className="hidden sm:inline">Manage Experiences</span>
        </h2>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Experience</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {experiences?.map((exp) => (
          <Card key={exp._id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{exp.position}</CardTitle>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(exp)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                  </p>
                </div>
                <div>
                  <p className="text-sm">{exp.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Achievements:</h4>
                  <ul className="list-disc list-inside text-sm">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="company">Company</label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="position">Position</label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate">Start Date</label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate">End Date (Optional)</label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="technologies">Technologies (one per line)</label>
              <Textarea
                id="technologies"
                value={formData.technologies?.join('\n')}
                onChange={(e) => handleArrayInputChange(e, 'technologies')}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="achievements">Achievements (one per line)</label>
              <Textarea
                id="achievements"
                value={formData.achievements?.join('\n')}
                onChange={(e) => handleArrayInputChange(e, 'achievements')}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingExperience ? 'Update' : 'Add'} Experience
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the experience at {experienceToDelete?.company}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteExperienceMutation.isPending}
            >
              {deleteExperienceMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExperienceManager; 