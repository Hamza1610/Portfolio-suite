import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Wand2, RefreshCw, Upload } from 'lucide-react';
import { useBlogPostMutation, useImageUpload, useBlogPost } from '@/hooks/useApi';
import { blogApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import RichTextEditor from '@/components/RichTextEditor';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const { mutate: saveBlogPost, isLoading: isSaving } = useBlogPostMutation();
  const { mutate: uploadImage, isLoading: isUploading } = useImageUpload();
  const { data: existingPost, isLoading: isLoadingPost } = useBlogPost(id || '');
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    topic: '',
    tone: 'professional',
    length: '1000',
    readTime: 5,
    published: true,
    featuredImage: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  // Load existing post data if editing
  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        excerpt: existingPost.excerpt,
        content: existingPost.content || '',
        tags: existingPost.tags.join(', '),
        topic: '',
        tone: 'professional',
        length: '1000',
        readTime: existingPost.readTime,
        published: existingPost.published,
        featuredImage: existingPost.featuredImage || ''
      });
    }
  }, [existingPost]);

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      uploadImage(formData, {
        onSuccess: (response) => {
          // Log the response to see its structure
          console.log('Upload response:', response);
          
          // The URL might be in response.data.url or just response.url
          const imageUrl = response.data?.url || response.url;
          
          if (!imageUrl) {
            throw new Error('No image URL in response');
          }

          setFormData(prev => ({
            ...prev,
            featuredImage: imageUrl
          }));

          toast({
            title: 'Success',
            description: 'Image uploaded successfully',
          });
        },
        onError: (error) => {
          console.error('Image upload error:', error);
          toast({
            title: 'Error',
            description: 'Failed to upload image',
            variant: 'destructive',
          });
        }
      });
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    }
  };

  const generateBlogContent = async () => {
    if (!formData.topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a blog topic before generating content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await blogApi.generateBlogContent({
        topic: formData.topic,
        tone: formData.tone,
        length: formData.length,
        keywords: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      });

      const { title, excerpt, content, tags } = response.data;

      setFormData(prev => ({
        ...prev,
        title,
        excerpt,
        content,
        tags: tags.join(', ')
      }));

      toast({
        title: "Content Generated!",
        description: "AI has generated your blog content. You can now edit and refine it."
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const refineBlogContent = async () => {
    if (!formData.content) {
      toast({
        title: "No Content to Refine",
        description: "Please generate or add content first.",
        variant: "destructive"
      });
      return;
    }

    setIsRefining(true);
    
    try {
      const response = await blogApi.refineBlogContent({
        content: formData.content,
        tone: formData.tone,
        improvements: ['clarity', 'engagement', 'flow']
      });

      setFormData(prev => ({
        ...prev,
        content: response.data.content
      }));

      toast({
        title: "Content Refined!",
        description: "AI has enhanced your blog content."
      });
    } catch (error) {
      console.error('Error refining content:', error);
      toast({
        title: "Error",
        description: "Failed to refine content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.excerpt) {
        toast({
          title: 'Error',
          description: 'Title and excerpt are required',
          variant: 'destructive',
        });
        return;
      }

      // Create a slug from the title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const blogData = {
        title: formData.title.trim(),
        slug: slug,
        excerpt: formData.excerpt.trim(),
        content: formData.content || '',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        readTime: formData.readTime || 5,
        published: formData.published,
        featuredImage: formData.featuredImage || '',
        publishedAt: formData.published ? new Date().toISOString() : undefined,
        seo: {
          metaTitle: formData.title.trim(),
          metaDescription: formData.excerpt.trim(),
          keywords: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
        }
      };

      console.log('Sending blog data:', blogData); // Debug log

      if (isEditing && id) {
        saveBlogPost({ id, ...blogData }, {
          onSuccess: () => {
            toast({
              title: 'Success',
              description: 'Blog post updated successfully',
            });
            navigate('/blog');
          },
          onError: (error) => {
            console.error('Error updating blog post:', error);
            toast({
              title: 'Error',
              description: error.message || 'Failed to update blog post',
              variant: 'destructive',
            });
          }
        });
      } else {
        saveBlogPost(blogData, {
          onSuccess: () => {
            toast({
              title: 'Success',
              description: 'Blog post created successfully',
            });
            navigate('/blog');
          },
          onError: (error) => {
            console.error('Error creating blog post:', error);
            toast({
              title: 'Error',
              description: error.message || 'Failed to create blog post',
              variant: 'destructive',
            });
          }
        });
      }
    } catch (error) {
      console.error('Error preparing blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to prepare blog post data',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/blog')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Button>
                <h1 className="text-3xl font-bold text-gradient">
                  {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h1>
              </div>
            </div>

            {isLoadingPost ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading blog post...</p>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* AI Generation Panel - Only show for new posts */}
                {!isEditing && (
                  <div className="glass-effect p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-primary" />
                      AI Content Generator
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="topic">Blog Topic</Label>
                        <Input
                          id="topic"
                          placeholder="e.g., React Best Practices"
                          value={formData.topic}
                          onChange={(e) => handleInputChange('topic', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="tone">Tone</Label>
                        <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="length">Target Length</Label>
                        <Select value={formData.length} onValueChange={(value) => handleInputChange('length', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="500">500 words</SelectItem>
                            <SelectItem value="1000">1000 words</SelectItem>
                            <SelectItem value="1500">1500 words</SelectItem>
                            <SelectItem value="2000">2000 words</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={generateBlogContent}
                          disabled={isGenerating}
                          className="flex-1"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 mr-2" />
                              Generate Content
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={refineBlogContent}
                          disabled={isRefining || !formData.content}
                        >
                          {isRefining ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            'Refine'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Blog Form */}
                <div className={`glass-effect p-6 rounded-lg ${isEditing ? 'lg:col-span-2' : ''}`}>
                  <h2 className="text-xl font-semibold mb-4">Blog Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter blog title..."
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief description of the blog post..."
                        rows={3}
                        className="min-h-[100px] resize-y"
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        placeholder="React, TypeScript, Web Development"
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="featuredImage">Featured Image</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="featuredImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="cursor-pointer"
                          disabled={isUploading}
                        />
                        {formData.featuredImage && (
                          <div className="relative">
                            <img
                              src={formData.featuredImage}
                              alt="Featured"
                              className="w-16 h-16 object-cover rounded-lg"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error('Image failed to load:', formData.featuredImage);
                                e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                              }}
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 w-6 h-6"
                              onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                            >
                              ×
                            </Button>
                          </div>
                        )}
                        {isUploading && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <div className="min-h-[400px] border rounded-lg">
                        <RichTextEditor
                          content={formData.content}
                          onChange={(content) => handleInputChange('content', content)}
                          placeholder="Start writing your content..."
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="readTime">Read Time (minutes)</Label>
                      <Input
                        id="readTime"
                        type="number"
                        min="1"
                        value={formData.readTime}
                        onChange={(e) => handleInputChange('readTime', e.target.value)}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {isEditing ? 'Update Post' : 'Create Post'}
                          </>
                        )}
                      </Button>

                      {isEditing && (
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/blog/${id}`)}
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateBlog;
