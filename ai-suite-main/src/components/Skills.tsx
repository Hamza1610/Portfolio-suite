import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSkills } from '@/hooks/useApi';

const Skills = () => {
  const { data: skills, isLoading, error } = useSkills();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load skills</p>
        </div>
      </div>
    );
  }

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: "🎨",
      skills: skills?.filter(skill => skill.category === 'Frontend') || []
    },
    {
      title: "Backend Development",
      icon: "⚙️",
      skills: skills?.filter(skill => skill.category === 'Backend') || []
    },
    {
      title: "AI & Machine Learning",
      icon: "🤖",
      skills: skills?.filter(skill => skill.category === 'AI') || []
    },
    {
      title: "DevOps & Tools",
      icon: "🛠️",
      skills: skills?.filter(skill => skill.category === 'DevOps') || []
    }
  ];

  const tools = [
    "VS Code", "Figma", "Postman", "Notion", "Slack", "Linear", 
    "Supabase", "Prisma", "Stripe", "Firebase", "Cloudinary", "Sanity"
  ];

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            My <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and professional tools
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category) => (
              <Card key={category.title} className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4 text-center">Tools & Technologies</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
