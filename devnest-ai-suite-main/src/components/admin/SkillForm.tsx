import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useSkillMutation } from '@/hooks/useApi';

interface SkillFormProps {
  skill?: {
    _id?: string;
    name: string;
    level: number;
    category: string;
    order?: number;
  };
  onClose: () => void;
  onSave: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ skill, onClose, onSave }) => {
  const { toast } = useToast();
  const skillMutation = useSkillMutation();
  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    category: 'Frontend',
    order: 0
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        level: skill.level || 50,
        category: skill.category || 'Frontend',
        order: skill.order || 0
      });
    }
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Skill name is required.",
        variant: "destructive"
      });
      return;
    }

    if (formData.level < 0 || formData.level > 100) {
      toast({
        title: "Validation Error",
        description: "Skill level must be between 0 and 100.",
        variant: "destructive"
      });
      return;
    }

    try {
      const skillData = {
        _id: skill?._id,
        name: formData.name.trim(),
        level: formData.level,
        category: formData.category,
        order: formData.order
      };

      await skillMutation.mutateAsync(skillData);
      onSave();
    } catch (error: any) {
      console.error('Error saving skill:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save skill. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{skill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React, JavaScript, Python"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="AI">AI & Machine Learning</SelectItem>
                <SelectItem value="DevOps">DevOps & Tools</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="level">Skill Level: {formData.level}%</Label>
            <Slider
              value={[formData.level]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, level: value[0] }))}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              placeholder="Order in which to display the skill"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={skillMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {skillMutation.isPending ? 'Saving...' : skill ? 'Update' : 'Add'} Skill
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillForm;
