import React, { useState, useEffect } from 'react';
import { useEducationMutation } from '@/hooks/useApi';
import { useImageUpload } from '@/hooks/useApi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface EducationFormProps {
  educationId?: string;
  initialData?: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate?: string;
    description: string;
    achievements: string[];
    image?: string;
  };
}

const EducationForm: React.FC<EducationFormProps> = ({
  educationId,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: [''],
    image: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { mutate: createEducation, isPending: isCreating } = useEducationMutation();
  const { mutate: updateEducation, isPending: isUpdating } = useEducationMutation();
  const { mutate: uploadImage, isPending: isUploading } = useImageUpload();

  useEffect(() => {
    if (initialData) {
      setFormData({
        degree: initialData.degree,
        institution: initialData.institution,
        location: initialData.location,
        startDate: initialData.startDate,
        endDate: initialData.endDate || '',
        description: initialData.description,
        achievements: initialData.achievements.length > 0 ? initialData.achievements : [''],
        image: initialData.image || '',
      });
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, ''],
      });
  };

  const removeAchievement = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: newAchievements });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;

      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const response = await uploadImage(formData);
        imageUrl = response.url;
      }

      const educationData = {
        ...formData,
        image: imageUrl,
        achievements: formData.achievements.filter(a => a.trim() !== ''),
      };

      if (educationId) {
        updateEducation({ id: educationId, ...educationData });
      } else {
        createEducation(educationData);
      }

      toast.success(
        educationId
          ? 'Education updated successfully'
          : 'Education added successfully'
      );
    } catch (error) {
      toast.error('Failed to save education');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Degree</label>
            <Input
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              placeholder="e.g., Bachelor of Science"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Institution</label>
            <Input
              value={formData.institution}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
              placeholder="e.g., University of Technology"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., New York, USA"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(new Date(formData.startDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        startDate: date ? date.toISOString() : '',
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(new Date(formData.endDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate ? new Date(formData.endDate) : undefined}
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        endDate: date ? date.toISOString() : '',
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your education experience"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Achievements</label>
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={achievement}
                    onChange={(e) =>
                      handleAchievementChange(index, e.target.value)
                    }
                    placeholder={`Achievement ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAchievement(index)}
                  >
                    ×
            </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addAchievement}
                className="w-full"
              >
                Add Achievement
            </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Institution Image</label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="education-image"
              />
              <label
                htmlFor="education-image"
                className="flex-1 cursor-pointer"
              >
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                </div>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isCreating || isUpdating || isUploading}
      >
        {isCreating || isUpdating || isUploading
          ? 'Saving...'
          : educationId
          ? 'Update Education'
          : 'Add Education'}
      </Button>
        </form>
  );
};

export default EducationForm;
