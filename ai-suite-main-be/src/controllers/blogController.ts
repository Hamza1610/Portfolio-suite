import { Request, Response } from 'express';
import BlogPost, { IBlogPost } from '../models/BlogPost';
import { generateBlogPost, refineBlogContent, generateMetaTags } from '../services/geminiService';

// List all blog posts
export const listBlogPosts = async (req: Request, res: Response) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
};

// Get blog post by ID
export const getBlogPostById = async (req: Request, res: Response) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
};

// Create a new blog post
export const createBlogPost = async (req: Request, res: Response) => {
  try {
    console.log('Creating blog post with data:', req.body);
    
    // Validate required fields
    const { title, content, excerpt, slug } = req.body;
    if (!title || !content || !excerpt || !slug) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          title: !title ? 'Title is required' : null,
          content: !content ? 'Content is required' : null,
          excerpt: !excerpt ? 'Excerpt is required' : null,
          slug: !slug ? 'Slug is required' : null
        }
      });
    }

    const newBlogPost = new BlogPost({
      ...req.body,
      readTime: req.body.readTime || Math.ceil(content.split(' ').length / 200), // Rough estimate: 200 words per minute
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedPost = await newBlogPost.save();
    console.log('Blog post created successfully:', savedPost);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ 
      message: 'Error creating blog post', 
      error: error.message,
      details: error.errors // Include validation errors if any
    });
  }
};

// Update a blog post
export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(updatedBlogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Error updating blog post', error: error.message });
  }
};

// Delete a blog post
export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
};

// Generate blog content using AI
export const generateAIBlogContent = async (req: Request, res: Response) => {
  try {
    const { topic, tone, length, keywords } = req.body;

    if (!topic || !tone || !length) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: {
          topic: !topic ? 'Topic is required' : null,
          tone: !tone ? 'Tone is required' : null,
          length: !length ? 'Length is required' : null
        }
      });
    }

    const generatedContent = await generateBlogPost(topic, tone, length, keywords);
    res.status(200).json(generatedContent);
  } catch (error) {
    console.error('Error generating blog content:', error);
    res.status(500).json({
      message: 'Error generating blog content',
      error: error.message
    });
  }
};

// Refine blog content using AI
export const refineAIBlogContent = async (req: Request, res: Response) => {
  try {
    const { content, tone, improvements } = req.body;

    if (!content || !tone) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: {
          content: !content ? 'Content is required' : null,
          tone: !tone ? 'Tone is required' : null
        }
      });
    }

    const refinedContent = await refineBlogContent(content, tone, improvements);
    res.status(200).json({ content: refinedContent });
  } catch (error) {
    console.error('Error refining blog content:', error);
    res.status(500).json({
      message: 'Error refining blog content',
      error: error.message
    });
  }
};

// Generate SEO meta tags using AI
export const generateAIMetaTags = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: {
          title: !title ? 'Title is required' : null,
          content: !content ? 'Content is required' : null
        }
      });
    }

    const metaTags = await generateMetaTags(title, content);
    res.status(200).json(metaTags);
  } catch (error) {
    console.error('Error generating meta tags:', error);
    res.status(500).json({
      message: 'Error generating meta tags',
      error: error.message
    });
  }
}; 