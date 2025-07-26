import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X, Users, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeParsingStepProps {
  resumes: File[];
  onUpdate: (resumes: File[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ResumeParsingStep: React.FC<ResumeParsingStepProps> = ({
  resumes,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const newFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (allowedTypes.includes(file.type)) {
        if (resumes.length + newFiles.length < 10) {
          newFiles.push(file);
        }
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (newFiles.length > 0) {
      onUpdate([...resumes, ...newFiles]);
      toast({
        title: "Files uploaded successfully",
        description: `${newFiles.length} resume(s) uploaded.`
      });
    }

    if (invalidFiles.length > 0) {
      toast({
        title: "Some files were skipped",
        description: `Invalid file types: ${invalidFiles.join(', ')}`,
        variant: "destructive"
      });
    }

    if (resumes.length + newFiles.length >= 10) {
      toast({
        title: "Upload limit reached",
        description: "Maximum 10 resumes allowed.",
        variant: "destructive"
      });
    }
  }, [resumes, onUpdate, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const updatedResumes = resumes.filter((_, i) => i !== index);
    onUpdate(updatedResumes);
    toast({
      title: "File removed",
      description: "Resume has been removed from the list."
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canProceed = resumes.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Upload Resumes</h2>
        <p className="text-muted-foreground">Upload up to 10 candidate resumes for analysis</p>
      </div>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/20">
        <CardContent className="p-8">
          <div
            className={`upload-zone ${dragActive ? 'dragover' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resume-upload"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
              disabled={resumes.length >= 10}
            />
            <label htmlFor="resume-upload" className="cursor-pointer block">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {resumes.length >= 10 ? 'Upload limit reached' : 'Upload Resume Files'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span>PDF, DOC, DOCX</span>
                  <span>•</span>
                  <span>Up to 10 files</span>
                  <span>•</span>
                  <span>{resumes.length}/10 uploaded</span>
                </div>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {resumes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Uploaded Resumes ({resumes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resumes.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type.includes('pdf') ? 'PDF' : 'DOC'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          size="lg"
          className="px-8"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Job Description
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="px-8"
        >
          Continue to Matching & Scoring
        </Button>
      </div>
    </div>
  );
};