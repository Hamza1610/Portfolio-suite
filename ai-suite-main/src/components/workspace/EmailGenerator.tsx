import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { workspaceApi } from '@/lib/api';

const EmailGenerator = () => {
  const [formData, setFormData] = useState({
    category: '',
    purpose: '',
    recipientName: '',
    additionalContext: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const { toast } = useToast();

  const emailCategories = [
    { value: 'business', label: 'Business' },
    { value: 'job-application', label: 'Job Application' },
    { value: 'networking', label: 'Networking' },
    { value: 'follow-up', label: 'Follow-Up' },
    { value: 'collaboration', label: 'Collaboration' },
    { value: 'inquiry', label: 'Inquiry' }
  ];

  const handleGenerate = async () => {
    if (!formData.category || !formData.purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in the category and purpose fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await workspaceApi.generateEmail(formData);
      setGeneratedEmail(response.data.email);
      
      toast({
        title: "Email Generated",
        description: "Your email has been successfully generated!",
      });
    } catch (error: any) {
      console.error('Error generating email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!generatedEmail) {
      toast({
        title: "No Content to Refine",
        description: "Please generate an email first.",
        variant: "destructive",
      });
      return;
    }

    setIsRefining(true);
    
    try {
      const response = await workspaceApi.refineContent({
        content: generatedEmail,
        type: 'email',
        improvements: ['clarity', 'professionalism', 'impact']
      });
      
      setGeneratedEmail(response.data.content);
      
      toast({
        title: "Email Refined",
        description: "Your email has been enhanced!",
      });
    } catch (error: any) {
      console.error('Error refining email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refine email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied to Clipboard",
      description: "Email content has been copied to your clipboard.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-gradient">Email Generator</CardTitle>
          <CardDescription>
            Generate professional emails with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category">Email Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select email category" />
              </SelectTrigger>
              <SelectContent>
                {emailCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              placeholder="e.g., Schedule a meeting, Request information"
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="recipient">Recipient Name (Optional)</Label>
            <Input
              id="recipient"
              placeholder="e.g., John Smith"
              value={formData.recipientName}
              onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Any specific details or context for the email..."
              value={formData.additionalContext}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
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
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Generated Email</CardTitle>
          <CardDescription>
            Your AI-generated email will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedEmail ? (
            <div className="space-y-4">
              <Textarea
                value={generatedEmail}
                onChange={(e) => setGeneratedEmail(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Email
                </Button>
                <Button onClick={handleRefine} variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refine
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Generate an email to see it here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailGenerator;
