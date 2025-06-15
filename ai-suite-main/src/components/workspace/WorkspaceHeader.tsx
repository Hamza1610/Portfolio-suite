
import React from 'react';
import { Brain } from 'lucide-react';

const WorkspaceHeader = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/20 rounded-full">
            <Brain className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
          AI Workspace
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your personal AI assistant for professional communication, resume building, 
          and career development. Generate tailored content with the power of AI.
        </p>
      </div>
    </section>
  );
};

export default WorkspaceHeader;
