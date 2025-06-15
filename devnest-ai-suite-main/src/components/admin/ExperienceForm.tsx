import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useExperienceMutation } from '@/hooks/useApi';

interface ExperienceFormProps {
  experience?: {
    _id?: string;
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
    technologies: string[];
    achievements: string[];
    order?: number;
  };
  onClose: () => void;
  onSave: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onClose, onSave }) => {
  const { toast } = useToast();
  const { mutate: mutateExperience, isLoading } = useExperienceMutation();

  const [formData, setFormData] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: '',
    achievements: '',
    order: 0
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        ...experience,
        technologies: experience.technologies.join(', '),
        achievements: experience.achievements.join('\n')
      });
    }
  }, [experience]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const technologies = formData.technologies
      .split(',')
      .map((tech) => tech.trim())
      .filter(Boolean);

    const achievements = formData.achievements
      .split('\n')
      .map((achievement) => achievement.trim())
      .filter(Boolean);

    const experienceData = {
      ...formData,
      technologies,
      achievements,
    };

    mutateExperience(experienceData, {
          onSuccess: () => {
        toast({
          title: "Success",
          description: experience ? "Experience updated successfully" : "Experience created successfully",
        });
        onSave();
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{experience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="position">Job Title</Label>
        <Input
              id="position"
              name="position"
              value={formData.position}
          onChange={handleInputChange}
          placeholder="e.g., Senior Software Engineer"
          required
        />
      </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
          name="company"
              value={formData.company}
          onChange={handleInputChange}
          placeholder="e.g., Tech Corp"
          required
            />
          </div>

      <div className="grid grid-cols-2 gap-4">
            <div>
          <Label htmlFor="startDate">Start Date</Label>
            <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            />
          </div>

            <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            placeholder="Leave empty if current"
          />
        </div>
      </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
          name="description"
              value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your responsibilities and achievements"
              className="min-h-[100px]"
          required
            />
          </div>

          <div>
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
          name="technologies"
              value={formData.technologies}
          onChange={handleInputChange}
          placeholder="e.g., React, Node.js, TypeScript"
              required
            />
          </div>

          <div>
            <Label htmlFor="achievements">Achievements (one per line)</Label>
            <Textarea
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleInputChange}
              placeholder="List your key achievements"
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
              onClick={onClose}
        >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : experience ? 'Update Experience' : 'Create Experience'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceForm;
