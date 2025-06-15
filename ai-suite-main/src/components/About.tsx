import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            About <span className="text-gradient">Me</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="aspect-square rounded-lg overflow-hidden mb-6">
                <img 
                  src="/me1.png" 
                  alt="Muhammad Hamza" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Button
                className="w-full"
                onClick={() => window.open('/resume.pdf', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Background</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I am a passionate Full Stack Developer with expertise in modern web technologies. 
                  With a strong foundation in both frontend and backend development, I create 
                  scalable and user-friendly applications. My journey in tech has equipped me 
                  with the skills to tackle complex problems and deliver efficient solutions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-muted-foreground">Kaduna, Nigeria</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Contact</h3>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Email: hamza.00dev1@gmail.com
                  </p>
                  <p className="text-muted-foreground">
                    Phone: +2349026880099
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Social Links</h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/Hamza1610"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/muhammad-hamza-7239b9237"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://twitter.com/Muhamma90584326"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    X (Twitter)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
