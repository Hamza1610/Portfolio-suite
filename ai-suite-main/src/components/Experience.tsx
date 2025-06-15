import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExperiences } from '@/hooks/useApi';

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

const Experience = () => {
  const { data: experiences, isLoading, error } = useExperiences();

  if (isLoading) {
    return (
      <section id="experience" className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded mb-6"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experience" className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-red-500">Failed to load experiences</div>
        </div>
      </section>
    );
    }

  return (
    <section id="experience" className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            My professional journey through various roles and projects, 
            building expertise in full-stack development and team collaboration.
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {experiences?.map((exp) => (
            <Card key={exp._id} className="glass-effect border-primary/20 group hover:glow-effect transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg md:text-xl text-primary mb-2">{exp.position}</CardTitle>
                      <div className="flex flex-col gap-1 text-sm md:text-base text-muted-foreground">
                        <span className="font-semibold">{exp.company}</span>
                        <span>{new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 p-4 md:p-6 pt-0">
                <div className="text-sm md:text-base text-muted-foreground">
                  {exp.description}
                </div>
                
                <div>
                  <h4 className="text-xs md:text-sm font-semibold text-primary mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-primary/30 text-primary text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs md:text-sm font-semibold text-primary mb-3">Key Achievements:</h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Download Resume CTA */}
        <div className="text-center mt-12 md:mt-16">
          <div className="glass-effect p-6 md:p-8 rounded-lg inline-block max-w-md mx-auto">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-4">Want to know more?</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6">Download my full resume for detailed information about my experience and projects.</p>
            <button className="bg-primary hover:bg-primary/90 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base">
              Download Resume (PDF)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
