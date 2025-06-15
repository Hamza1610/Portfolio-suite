
import React from 'react';
import Navbar from '@/components/Navbar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import WorkspaceTabs from '@/components/workspace/WorkspaceTabs';
import Footer from '@/components/Footer';

const Workspace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <WorkspaceHeader />
        <WorkspaceTabs />
      </div>
      <Footer />
    </div>
  );
};

export default Workspace;
