import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, RefreshCw, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { workspaceApi } from '@/lib/api';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CoverLetterBuilder = () => {
  const [formData, setFormData] = useState({
    roleTitle: '',
    targetCompany: '',
    hiringManager: '',
    jobDescription: '',
    personalMotivation: ''
  });
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.roleTitle || !formData.targetCompany) {
      toast({
        title: "Missing Information",
        description: "Please fill in the role title and target company fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await workspaceApi.generateCoverLetter(formData);
      setGeneratedCoverLetter(response.data.coverLetter);
      
      toast({
        title: "Cover Letter Generated",
        description: "Your personalized cover letter has been successfully generated!",
      });
    } catch (error: any) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!generatedCoverLetter) {
      toast({
        title: "No Content to Refine",
        description: "Please generate a cover letter first.",
        variant: "destructive",
      });
      return;
    }

    setIsRefining(true);
    
    try {
      const response = await workspaceApi.refineContent({
        content: generatedCoverLetter,
        type: 'cover-letter',
        improvements: ['impact', 'personalization', 'professionalism']
      });
      
      setGeneratedCoverLetter(response.data.content);
      
      toast({
        title: "Cover Letter Refined",
        description: "Your cover letter has been enhanced!",
      });
    } catch (error: any) {
      console.error('Error refining cover letter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refine cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCoverLetter);
    toast({
      title: "Copied to Clipboard",
      description: "Cover letter content has been copied to your clipboard.",
    });
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    const fileName = `cover_letter_${formData.roleTitle.replace(/\s+/g, '_')}`;

    if (format === 'pdf') {
      const doc = new jsPDF();
      const lines = generatedCoverLetter.split('\n');
      let y = 20;
      const lineHeight = 7;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;
      
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.height - margin) {
          doc.addPage();
          y = margin;
        }
        
        const splitLines = doc.splitTextToSize(line, pageWidth - (2 * margin));
        doc.text(splitLines, margin, y);
        y += lineHeight * splitLines.length;
      });

      doc.save(`${fileName}.pdf`);
    } else {
      // Create DOCX document
      const doc = new Document({
        sections: [{
          properties: {},
          children: generatedCoverLetter.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun(line)],
            })
          ),
        }],
      });

      // Generate and download DOCX
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    
    toast({
      title: "Cover Letter Downloaded",
      description: `Your cover letter has been downloaded as a ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-gradient">Cover Letter Builder</CardTitle>
          <CardDescription>
            Create compelling, personalized cover letters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="role">Role Title</Label>
            <Input
              id="role"
              placeholder="e.g., Senior Software Engineer"
              value={formData.roleTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="company">Target Company</Label>
            <Input
              id="company"
              placeholder="e.g., Google, Microsoft, Startup Inc."
              value={formData.targetCompany}
              onChange={(e) => setFormData(prev => ({ ...prev, targetCompany: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="manager">Hiring Manager (Optional)</Label>
            <Input
              id="manager"
              placeholder="e.g., John Smith"
              value={formData.hiringManager}
              onChange={(e) => setFormData(prev => ({ ...prev, hiringManager: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="job-desc">Job Description (Optional)</Label>
            <Textarea
              id="job-desc"
              placeholder="Paste the job description here for better personalization..."
              value={formData.jobDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="motivation">Personal Motivation</Label>
            <Textarea
              id="motivation"
              placeholder="Why are you interested in this role and company? What excites you about this opportunity?"
              value={formData.personalMotivation}
              onChange={(e) => setFormData(prev => ({ ...prev, personalMotivation: e.target.value }))}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Cover Letter...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Cover Letter
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Generated Cover Letter</CardTitle>
          <CardDescription>
            Your AI-crafted cover letter will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedCoverLetter ? (
            <div className="space-y-4">
              <Textarea
                value={generatedCoverLetter}
                onChange={(e) => setGeneratedCoverLetter(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                      Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload('docx')}>
                      Download as DOCX
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handleRefine} variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refine
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Generate a cover letter to see it here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterBuilder;
