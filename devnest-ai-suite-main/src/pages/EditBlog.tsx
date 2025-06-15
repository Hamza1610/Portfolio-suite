import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useApi';
import CreateBlog from './CreateBlog';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useBlogPost(id || '');

  useEffect(() => {
    if (error) {
      navigate('/blog');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return <CreateBlog />;
};

export default EditBlog; 