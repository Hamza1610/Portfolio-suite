import React from 'react';
import { useEducation } from '@/hooks/useApi';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const Education = () => {
  const { data: education, isLoading, error } = useEducation();

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !education) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Education</h2>
          <p className="text-muted-foreground">Failed to load education history</p>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            My <span className="text-gradient">Education</span>
          </h2>
          
          <div className="space-y-8">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="glass-effect p-6 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                    <p className="text-lg text-primary mb-2">{edu.institution}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                      </div>
                      {edu.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {edu.location}
                        </div>
                      )}
                    </div>

                    {edu.description && (
                      <p className="text-muted-foreground mb-4">{edu.description}</p>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Achievements:</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {edu.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {edu.image && (
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={edu.image}
                        alt={edu.institution}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education; 