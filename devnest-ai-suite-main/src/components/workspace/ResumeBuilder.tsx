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
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { marked } from 'marked';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    roleTitle: '',
    targetCompany: '',
    jobDescription: '',
    personalHighlights: ''
  });
  const [generatedResume, setGeneratedResume] = useState('');
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
      const response = await workspaceApi.generateResume(formData);
      setGeneratedResume(response.data.resume);
      
      toast({
        title: "Resume Generated",
        description: "Your tailored resume has been successfully generated!",
      });
    } catch (error: any) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!generatedResume) {
      toast({
        title: "No Content to Refine",
        description: "Please generate a resume first.",
        variant: "destructive",
      });
      return;
    }

    setIsRefining(true);
    
    try {
      const response = await workspaceApi.refineContent({
        content: generatedResume,
        type: 'resume',
        improvements: ['ats-optimization', 'impact', 'clarity']
      });
      
      setGeneratedResume(response.data.content);
      
      toast({
        title: "Resume Refined",
        description: "Your resume has been enhanced!",
      });
    } catch (error: any) {
      console.error('Error refining resume:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refine resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopy = () => {
    try {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = generatedResume;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

    toast({
      title: "Copied to Clipboard",
      description: "Resume content has been copied to your clipboard.",
    });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (format: 'pdf' | 'docx' | 'google-docs') => {
    const fileName = `resume_${formData.roleTitle.replace(/\s+/g, '_')}`;

    if (format === 'google-docs') {
      try {
        const response = await workspaceApi.createGoogleDoc({
          content: generatedResume,
          title: fileName
        });

        if (response.data.success) {
          // Open the Google Doc in a new tab
          window.open(response.data.data.documentUrl, '_blank');
          
          toast({
            title: "Google Doc Created",
            description: "Your resume has been created as a Google Doc and opened in a new tab.",
          });
        }
      } catch (error: any) {
        console.error('Error creating Google Doc:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to create Google Doc. Please try again.",
          variant: "destructive",
        });
      }
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const margin = 20;
      const lineHeight = 7;
      let y = margin;
      const pageWidth = doc.internal.pageSize.width;
      const contentWidth = pageWidth - (2 * margin);
      
      // Helper function to add text with proper wrapping
      const addText = (text: string, x: number, y: number, options: { 
        bold?: boolean, 
        fontSize?: number,
        indent?: number 
      } = {}) => {
        const { bold = false, fontSize = 12, indent = 0 } = options;
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        const splitLines = doc.splitTextToSize(text, contentWidth - indent);
        doc.text(splitLines, x + indent, y);
        return splitLines.length * lineHeight;
      };

      // Process the content line by line
      const lines = generatedResume.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if we need a new page
        if (y > doc.internal.pageSize.height - margin) {
          doc.addPage();
          y = margin;
        }

        // Handle headers
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 1;
          const text = line.replace(/^#+\s*/, '');
          y += addText(text, margin, y, { 
            bold: true, 
            fontSize: 16 - (level * 2) 
          }) + 5;
        }
        // Handle bullet points
        else if (line.startsWith('*')) {
          const text = line.replace(/^\*\s*/, '');
          // Check if it's a sub-bullet (starts with space)
          const isSubBullet = text.startsWith(' ');
          const bulletText = isSubBullet ? text.trim() : text;
          const bulletSymbol = isSubBullet ? '◦' : '•';
          const indent = isSubBullet ? 10 : 5;
          
          y += addText(`${bulletSymbol} ${bulletText}`, margin, y, { indent }) + 2;
        }
        // Handle bold text
        else if (line.includes('**')) {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          let currentX = margin;
          let maxHeight = 0;
          
          parts.forEach((part) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const text = part.slice(2, -2);
              const height = addText(text, currentX, y, { bold: true });
              currentX += doc.getTextWidth(text);
              maxHeight = Math.max(maxHeight, height);
            } else if (part.trim()) {
              const height = addText(part, currentX, y);
              currentX += doc.getTextWidth(part);
              maxHeight = Math.max(maxHeight, height);
            }
          });
          
          y += maxHeight + 2;
        }
        // Handle regular text
        else if (line.trim()) {
          y += addText(line, margin, y) + 2;
        }
        // Handle empty lines
        else {
          y += lineHeight;
        }
      }

      doc.save(`${fileName}.pdf`);
    } else {
      try {
        // Parse the markdown content
        const lines = generatedResume.split('\n');
        const docElements = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (!line) {
            docElements.push(new Paragraph({ spacing: { after: 200 } }));
            continue;
          }

          // Handle headers
          if (line.startsWith('#')) {
            const level = line.match(/^#+/)?.[0].length || 1;
            const text = line.replace(/^#+\s*/, '');
            docElements.push(
              new Paragraph({
                text,
                heading: `Heading${level}` as any,
                spacing: { after: 200 },
                alignment: AlignmentType.LEFT
              })
            );
            continue;
          }

          // Handle bullet points
          if (line.startsWith('*')) {
            const text = line.replace(/^\*\s*/, '');
            const isSubBullet = text.startsWith(' ');
            const bulletText = isSubBullet ? text.trim() : text;
            
            docElements.push(
              new Paragraph({
                text: bulletText,
                bullet: { level: isSubBullet ? 1 : 0 },
                spacing: { after: 100 }
              })
            );
            continue;
          }

          // Handle bold text
          if (line.includes('**')) {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            const runs = parts.map(part => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return new TextRun({
                  text: part.slice(2, -2),
                  bold: true
                });
              }
              return new TextRun(part);
            });

            docElements.push(
              new Paragraph({
                children: runs,
                spacing: { after: 100 }
              })
            );
            continue;
          }

          // Regular text
          docElements.push(
            new Paragraph({
              text: line,
              spacing: { after: 100 }
            })
          );
        }

        // Create the document with styles
        const doc = new Document({
          sections: [{
            properties: {},
            children: docElements
          }],
          styles: {
            paragraphStyles: [
              {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                  size: 28,
                  bold: true,
                  color: "000000"
                },
                paragraph: {
                  spacing: {
                    after: 200
                  }
                }
              },
              {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                  size: 24,
                  bold: true,
                  color: "000000"
                },
                paragraph: {
                  spacing: {
                    after: 200
                  }
                }
              }
            ]
          }
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
    
    toast({
      title: "Resume Downloaded",
          description: "Your resume has been downloaded as a DOCX file with proper formatting.",
        });
      } catch (error) {
        console.error('Error generating DOCX:', error);
        toast({
          title: "Error",
          description: "Failed to generate DOCX file. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-gradient">Resume Builder</CardTitle>
          <CardDescription>
            Create ATS-friendly resumes tailored to specific roles
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
            <Label htmlFor="job-desc">Job Description (Optional)</Label>
            <Textarea
              id="job-desc"
              placeholder="Paste the job description here to tailor your resume..."
              value={formData.jobDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="highlights">Personal Highlights</Label>
            <Textarea
              id="highlights"
              placeholder="Your key achievements, skills, and experiences..."
              value={formData.personalHighlights}
              onChange={(e) => setFormData(prev => ({ ...prev, personalHighlights: e.target.value }))}
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
                Generating Resume...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Generated Resume</CardTitle>
          <CardDescription>
            Your AI-tailored resume will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedResume ? (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none bg-white/10 p-4 rounded-lg">
                <div 
                  className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words max-w-full overflow-hidden resume-content"
                  style={{ 
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: marked.parse(generatedResume, {
                      breaks: true,
                      gfm: true,
                      headerIds: true,
                      mangle: false
                    }) 
                  }} 
                />
                <style>
                  {`
                    .resume-content h1 {
                      font-size: 1.5rem;
                      font-weight: 600;
                      margin-top: 1.5rem;
                      margin-bottom: 1rem;
                      color: #2563eb;
                      border-bottom: 2px solid #2563eb;
                      padding-bottom: 0.25rem;
                    }
                    .resume-content h2 {
                      font-size: 1.25rem;
                      font-weight: 600;
                      margin-top: 1.25rem;
                      margin-bottom: 0.75rem;
                      color: #1d4ed8;
                    }
                    .resume-content h3 {
                      font-size: 1.125rem;
                      font-weight: 600;
                      margin-top: 1rem;
                      margin-bottom: 0.5rem;
                      color: #1e40af;
                    }
                    .resume-content ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-top: 0.5rem;
                      margin-bottom: 0.5rem;
                    }
                    .resume-content li {
                      margin-bottom: 0.25rem;
                    }
                    .resume-content p {
                      margin-bottom: 0.75rem;
                    }
                    .dark .resume-content h1 {
                      color: #60a5fa;
                      border-bottom-color: #60a5fa;
                    }
                    .dark .resume-content h2 {
                      color: #93c5fd;
                    }
                    .dark .resume-content h3 {
                      color: #bfdbfe;
                    }
                  `}
                </style>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopy} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={handleRefine} variant="outline" size="sm" disabled={isRefining}>
                  {isRefining ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Refining...
                    </>
                  ) : (
                    <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refine
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
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
                    <DropdownMenuItem onClick={() => handleDownload('google-docs')}>
                      Create Google Doc
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Generate a resume to see the preview
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilder;
