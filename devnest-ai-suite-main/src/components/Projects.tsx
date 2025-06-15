import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useApi';

const Projects = () => {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load projects</p>
        </div>
      </div>
    );
  }

  const featuredProjects = projects?.filter(project => project.featured) || [];
  const otherProjects = projects?.filter(project => !project.featured) || [];

  const handleLiveDemo = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewCode = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const ProjectCard = ({ project }: { project: any }) => (
    <Card key={project._id} className="glass-effect group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
          {project.images && project.images.length > 0 ? (
            <img
              src={project.images[0]}
              alt={project.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold mb-2">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech: string) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          {project.liveUrl && (
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => handleLiveDemo(project.liveUrl)}
              className="flex-1"
            >
              Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => handleViewCode(project.githubUrl)}
              className="flex-1"
            >
              View Code
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          
          <div className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Other <span className="text-gradient">Projects</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
