import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useBlogPostMutation, useImageUpload } from '@/hooks/useApi';

interface BlogFormProps {
  postId?: string;
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    image?: string;
  };
}

const BlogForm: React.FC<BlogFormProps> = ({ postId, initialData }) => {
  const navigate = useNavigate();
  const { mutate: createPost, isLoading: isCreating } = useBlogPostMutation();
  const { mutate: updatePost, isLoading: isUpdating } = useBlogPostMutation();
  const { mutate: uploadImage, isLoading: isUploading } = useImageUpload();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    image: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        excerpt: initialData.excerpt,
        content: initialData.content,
        tags: initialData.tags.join(', '),
        image: initialData.image || '',
      });
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      uploadImage(formData, {
        onSuccess: (data) => {
          setFormData((prev) => ({ ...prev, image: data.url }));
          toast.success('Image uploaded successfully');
        },
        onError: () => {
          toast.error('Failed to upload image');
        },
      });
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const postData = {
      ...formData,
      tags,
    };

    if (postId) {
      updatePost(
        { id: postId, ...postData },
        {
          onSuccess: () => {
            toast.success('Blog post updated successfully');
            navigate('/blog');
          },
          onError: () => {
            toast.error('Failed to update blog post');
          },
        }
      );
    } else {
      createPost(postData, {
        onSuccess: () => {
          toast.success('Blog post created successfully');
          navigate('/blog');
        },
        onError: () => {
          toast.error('Failed to create blog post');
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter blog post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          placeholder="Enter a brief excerpt"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Write your blog post content"
          className="min-h-[300px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          placeholder="e.g., React, TypeScript, Web Development"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Featured Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="cursor-pointer"
        />
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isCreating || isUpdating || isUploading}
        >
          {isCreating || isUpdating ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/blog')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BlogForm; 