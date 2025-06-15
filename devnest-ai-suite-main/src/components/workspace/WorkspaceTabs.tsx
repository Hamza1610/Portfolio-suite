
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailGenerator from './EmailGenerator';
import ResumeBuilder from './ResumeBuilder';
import CoverLetterBuilder from './CoverLetterBuilder';

const WorkspaceTabs = () => {
  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="email">Email Generator</TabsTrigger>
            <TabsTrigger value="resume">Resume Builder</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-6">
            <EmailGenerator />
          </TabsContent>
          
          <TabsContent value="resume" className="space-y-6">
            <ResumeBuilder />
          </TabsContent>
          
          <TabsContent value="cover-letter" className="space-y-6">
            <CoverLetterBuilder />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default WorkspaceTabs;
