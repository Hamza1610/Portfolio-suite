import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Edit, Trash2, FileText, User, Briefcase, GraduationCap, Code, Eye, LogOut, FolderKanban, Mail } from 'lucide-react';
import SkillForm from '@/components/admin/SkillForm';
import ExperienceForm from '@/components/admin/ExperienceForm';
import EducationForm from '@/components/admin/EducationForm';
import ProjectForm from '@/components/admin/ProjectForm';
import { useSkills, useSkillMutation, useDeleteSkill, useProjects, useProjectMutation, useDeleteProject, useExperiences, useEducation, useDeleteExperience, useDeleteEducation } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ExperienceManager from '@/components/ExperienceManager';
import EducationManager from '@/components/EducationManager';
import { useAuth } from '@/contexts/AuthContext';

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [formType, setFormType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string } | null>(null);

  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: experiences, isLoading: experiencesLoading } = useExperiences();
  const { data: education, isLoading: educationLoading } = useEducation();

  const skillMutation = useSkillMutation();
  const projectMutation = useProjectMutation();
  const deleteSkill = useDeleteSkill();
  const deleteProject = useDeleteProject();
  const deleteExperience = useDeleteExperience();
  const deleteEducation = useDeleteEducation();

  const { logout } = useAuth();

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    setFormType(type);
  };

  const handleAdd = (type: string) => {
    setEditingItem(null);
    setFormType(type);
  };

  const handleDeleteClick = (id: string, type: string) => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      switch (itemToDelete.type) {
        case 'skills':
          await deleteSkill.mutateAsync(itemToDelete.id);
          break;
        case 'experience':
          await deleteExperience.mutateAsync(itemToDelete.id);
          break;
        case 'education':
          await deleteEducation.mutateAsync(itemToDelete.id);
          break;
        case 'projects':
          await deleteProject.mutateAsync(itemToDelete.id);
          break;
      }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFormClose = () => {
    setEditingItem(null);
    setFormType(null);
  };

  const renderOverview = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="glass-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Skills</CardTitle>
          <Code className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{skills?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Technical skills</p>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Experience</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{experiences?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Work experiences</p>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Education</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{education?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Educational background</p>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Portfolio projects</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderDeleteDialog = () => (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            This action cannot be undone. This will permanently delete the {itemToDelete?.type.slice(0, -1)}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const renderDataTable = (data: any[] | undefined, type: string, columns: string[]) => {
    if (!data) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading {type}...</p>
        </div>
      );
    }

    if (type === 'experience') {
      return <ExperienceManager />;
    }

    if (type === 'education') {
      return <EducationManager />;
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold capitalize">{type}</h3>
          <Button 
            onClick={() => handleAdd(type)} 
            size="sm" 
            className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-4"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Add {type.slice(0, -1)}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {data.map((item) => (
            <Card key={item._id} className="glass-effect">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    {type === 'skills' && (
                      <div>
                        <h4 className="font-medium truncate text-sm sm:text-base">{item.name}</h4>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          <span className="text-xs sm:text-sm text-muted-foreground">{item.level}%</span>
                        </div>
                      </div>
                    )}
                    
                    {type === 'projects' && (
                      <div>
                        <h4 className="font-medium truncate text-sm sm:text-base">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.technologies.map((tech: string) => (
                            <Badge key={tech} variant="outline" className="text-[10px] sm:text-xs">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1 sm:gap-2 self-end sm:self-start">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item, type)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(item._id, type)}
                      className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="py-8 sm:py-12 px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient">Admin Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Manage your portfolio content</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('/', '_blank')} 
                  className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  View Portfolio
                </Button>
                <Button 
                  variant="outline" 
                  onClick={logout} 
                  className="text-red-500 hover:text-red-600 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills</TabsTrigger>
                <TabsTrigger value="experience" className="text-xs sm:text-sm">Experience</TabsTrigger>
                <TabsTrigger value="education" className="text-xs sm:text-sm">Education</TabsTrigger>
                <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
              </TabsList>

              <div className="mt-4 sm:mt-6">
                <TabsContent value="overview">
                  {renderOverview()}
                </TabsContent>

                <TabsContent value="skills">
                  {renderDataTable(skills, 'skills', ['name', 'category', 'level'])}
                </TabsContent>

                <TabsContent value="experience">
                  {renderDataTable(experiences, 'experience', ['title', 'company', 'period'])}
                </TabsContent>

                <TabsContent value="education">
                  {renderDataTable(education, 'education', ['degree', 'institution', 'period'])}
                </TabsContent>

                <TabsContent value="projects">
                  {renderDataTable(projects, 'projects', ['title', 'description', 'technologies'])}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      {renderDeleteDialog()}
      {/* Forms */}
      {formType === 'skills' && (
        <SkillForm
          skill={editingItem}
          onClose={handleFormClose}
          onSave={() => {
            handleFormClose();
            // Data will be refreshed automatically by React Query
          }}
        />
      )}
      
      {formType === 'experience' && (
        <ExperienceForm
          experience={editingItem}
          onClose={handleFormClose}
          onSave={() => {
            handleFormClose();
            // Data will be refreshed automatically by React Query
          }}
        />
      )}
      
      {formType === 'education' && (
        <EducationForm
          education={editingItem}
          onClose={handleFormClose}
          onSave={() => {
            handleFormClose();
            // Data will be refreshed automatically by React Query
          }}
        />
      )}
      
      {formType === 'projects' && (
        <ProjectForm
          project={editingItem}
          onClose={handleFormClose}
          onSave={() => {
            handleFormClose();
            // Data will be refreshed automatically by React Query
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default Admin;
