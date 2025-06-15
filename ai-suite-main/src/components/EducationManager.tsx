import React, { useState } from 'react';
import { useEducation, useEducationMutation, useDeleteEducation } from '@/hooks/useApi';
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

interface Education {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
  logo?: string;
  order: number;
}

const EducationManager = () => {
  const { data: education, isLoading, error } = useEducation();
  const { mutate: mutateEducation } = useEducationMutation();
  const deleteEducationMutation = useDeleteEducation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: '',
    order: 0,
  });

  console.log('EducationManager rendered with:', {
    education,
    isLoading,
    error,
    isDialogOpen,
    deleteDialogOpen,
    educationToDelete,
    editingEducation,
    formData
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const values = e.target.value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, achievements: values }));
  };

  const handleEdit = (education: Education) => {
    console.log('Editing education:', education);
    setEditingEducation(education);
    setFormData({
      _id: education._id,
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      startDate: education.startDate.split('T')[0], // Convert to YYYY-MM-DD format
      endDate: education.endDate.split('T')[0], // Convert to YYYY-MM-DD format
      grade: education.grade || '',
      description: education.description || '',
      order: education.order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    
    // Ensure dates are in the correct format
    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate!).toISOString(),
      endDate: new Date(formData.endDate!).toISOString(),
    };

    mutateEducation(submitData, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setFormData({
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          grade: '',
          description: '',
          order: 0,
        });
        setEditingEducation(null);
        toast({
          title: "Success",
          description: "Education updated successfully",
        });
      },
      onError: (error) => {
        console.error('Submit error:', error);
        toast({
          title: "Error",
          description: "Failed to update education",
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = (education: Education) => {
    console.log('Delete button clicked for education:', education);
    setEducationToDelete(education);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (educationToDelete) {
      console.log('Confirming delete for education:', educationToDelete);
      console.log('Education ID to delete:', educationToDelete._id);
      
      deleteEducationMutation.mutate(educationToDelete._id, {
        onSuccess: (data) => {
          console.log('Delete successful:', data);
          setDeleteDialogOpen(false);
          setEducationToDelete(null);
          toast({
            title: "Success",
            description: "Education deleted successfully",
          });
        },
        onError: (error: any) => {
          console.error('Delete failed:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to delete education",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleAddNew = () => {
    setEditingEducation(null);
    setFormData({
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Education</h2>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Add Education
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
          <h2 className="text-2xl font-bold">Manage Education</h2>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load education data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          <span className="hidden sm:inline">Manage Education</span>
        </h2>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Education</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {education && education.length > 0 ? (
          education.map((edu) => (
            <Card key={edu._id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{edu.degree}</CardTitle>
                    <p className="text-sm text-muted-foreground">{edu.institution} • {edu.field}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(edu)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(edu)}
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
                      {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                    </p>
                    {edu.grade && (
                      <p className="text-sm text-muted-foreground">Grade: {edu.grade}</p>
                    )}
                  </div>
                  {edu.description && (
                    <div>
                      <p className="text-sm">{edu.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No education entries found. Add your first education entry!</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEducation ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="institution">Institution</label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="degree">Degree</label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="field">Field of Study</label>
              <Input
                id="field"
                name="field"
                value={formData.field}
                onChange={handleInputChange}
                required
              />
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
                <label htmlFor="endDate">End Date</label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="grade">Grade (Optional)</label>
              <Input
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description">Description (Optional)</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="order">Display Order</label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEducation ? 'Update' : 'Add'} Education
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
              This action cannot be undone. This will permanently delete the education at {educationToDelete?.institution}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteEducationMutation.isPending}
            >
              {deleteEducationMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EducationManager; 