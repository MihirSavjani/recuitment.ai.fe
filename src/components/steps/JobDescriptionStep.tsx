import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Bot, Edit3, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processJobDescription, generateJobDescription } from '@/lib/api';

interface JobDescriptionStepProps {
  jobDescription: string;
  onUpdate: (description: string) => void;
  onNext: () => void;
}

export const JobDescriptionStep: React.FC<JobDescriptionStepProps> = ({
  jobDescription,
  onUpdate,
  onNext
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upload' | 'ai' | 'manual'>('upload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiForm, setAiForm] = useState({
    jobTitle: '',
    experience: '',
    skills: '',
    company: '',
    type: '',
    industry: '',
    location: ''
  });
  const { toast } = useToast();

  // Auto-resize textarea when job description changes
  useEffect(() => {
    const textarea = document.getElementById('final-jd') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.max(12 * 16, textarea.scrollHeight);
      textarea.style.height = Math.min(newHeight, 40 * 16) + 'px';
    }
  }, [jobDescription]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
        setSelectedMethod('upload');
        setIsProcessing(true);
        
        try {
          const response = await processJobDescription(file);
          onUpdate(response.formatted_text);
          toast({
            title: "File processed successfully",
            description: `${file.name} has been processed in ${response.processing_time.toFixed(2)}s.`
          });
        } catch (error) {
          console.error('Error processing file:', error);
          toast({
            title: "Processing failed",
            description: error instanceof Error ? error.message : "Failed to process the file. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setSelectedMethod('ai');
    
    try {
      const request = {
        job_title: aiForm.jobTitle,
        experience: aiForm.experience,
        company: aiForm.company,
        job_type: aiForm.type,
        must_have_skills: aiForm.skills,
        industry: aiForm.industry,
        location: aiForm.location
      };

      const response = await generateJobDescription(request);
      onUpdate(response.formatted_text);
      
      toast({
        title: "Job description generated",
        description: `AI has successfully created your job description in ${response.processing_time.toFixed(2)}s.`
      });
    } catch (error) {
      console.error('Error generating job description:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate job description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = jobDescription.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Create Job Description</h2>
        <p className="text-muted-foreground">Choose how you'd like to create your job description</p>
      </div>

      {/* Method Selection Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Upload Method */}
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
            selectedMethod === 'upload' ? 'ring-2 ring-primary shadow-lg' : ''
          }`}
          onClick={() => setSelectedMethod('upload')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Upload JD</CardTitle>
            <CardDescription>Upload existing job description</CardDescription>
          </CardHeader>
          {selectedMethod === 'upload' && (
            <CardContent>
              <div className="upload-zone">
                <input
                  type="file"
                  id="jd-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
                <label htmlFor="jd-upload" className={`cursor-pointer ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
                      <p className="text-sm font-medium">Processing...</p>
                      <p className="text-xs text-muted-foreground mt-1">Please wait</p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX</p>
                    </>
                  )}
                </label>
              </div>
              {uploadedFile && (
                <div className="mt-4 file-item">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                  {isProcessing && (
                    <Loader2 className="w-4 h-4 text-primary animate-spin ml-auto" />
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* AI Generator Method */}
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
            selectedMethod === 'ai' ? 'ring-2 ring-primary shadow-lg' : ''
          }`}
          onClick={() => setSelectedMethod('ai')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">AI Generator</CardTitle>
            <CardDescription>Generate with AI assistance</CardDescription>
          </CardHeader>
          {selectedMethod === 'ai' && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="job-title" className="text-sm font-medium">Job Title</Label>
                  <Input
                    id="job-title"
                    value={aiForm.jobTitle}
                    onChange={(e) => setAiForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="e.g., Senior Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="experience" className="text-sm font-medium">Experience</Label>
                  <Input
                    id="experience"
                    value={aiForm.experience}
                    onChange={(e) => setAiForm(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g., 3-5 years"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                  <Input
                    id="company"
                    value={aiForm.company}
                    onChange={(e) => setAiForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                  <Select value={aiForm.type} onValueChange={(value) => setAiForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="skills" className="text-sm font-medium">Must-Have Skills</Label>
                <Input
                  id="skills"
                  value={aiForm.skills}
                  onChange={(e) => setAiForm(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="e.g., React, TypeScript, Node.js"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
                  <Input
                    id="industry"
                    value={aiForm.industry}
                    onChange={(e) => setAiForm(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., Technology"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Input
                    id="location"
                    value={aiForm.location}
                    onChange={(e) => setAiForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>
              <Button
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiForm.jobTitle || !aiForm.company}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    Generate Job Description
                  </>
                )}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Manual Method */}
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
            selectedMethod === 'manual' ? 'ring-2 ring-primary shadow-lg' : ''
          }`}
          onClick={() => setSelectedMethod('manual')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Edit3 className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Manual Entry</CardTitle>
            <CardDescription>Write from scratch</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Job Description Editor */}
      <div className="space-y-4">
        <Label htmlFor="final-jd" className="text-lg font-semibold">
          Final Job Description
        </Label>
        <p className="text-sm text-muted-foreground">
          This is your final job description. You can tweak the generated text, paste your own, or start fresh.
        </p>
        <Textarea
          id="final-jd"
          value={jobDescription}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="Enter or edit your job description here..."
          className="min-h-48 resize-none overflow-y-auto"
          style={{
            height: 'auto',
            minHeight: '12rem',
            maxHeight: '40rem'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            const newHeight = Math.max(12 * 16, target.scrollHeight);
            target.style.height = Math.min(newHeight, 40 * 16) + 'px';
          }}
          aria-label="Final job description editor"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="px-8"
        >
          Continue to Resume Parsing
        </Button>
      </div>
    </div>
  );
};