import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { JobDescriptionStep } from './steps/JobDescriptionStep';
import { ResumeParsingStep } from './steps/ResumeParsingStep';
import { MatchingStep } from './steps/MatchingStep';
import { Check } from 'lucide-react';

interface StepData {
  jobDescription: string;
  resumes: File[];
  matches: Array<{
    id: string;
    name: string;
    filename: string;
    missingSkills: string[];
    remarks: string;
    matchScore: number;
  }>;
}

const steps = [
  { id: 1, title: 'Job Description', description: 'Create or upload job requirements' },
  { id: 2, title: 'Resume Parsing', description: 'Upload candidate resumes' },
  { id: 3, title: 'Matching & Scoring', description: 'Review matches and reach out' }
];

export const RecruitmentFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<StepData>({
    jobDescription: '',
    resumes: [],
    matches: []
  });

  const updateData = (updates: Partial<StepData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <JobDescriptionStep
            jobDescription={data.jobDescription}
            onUpdate={(jobDescription) => updateData({ jobDescription })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ResumeParsingStep
            resumes={data.resumes}
            onUpdate={(resumes) => updateData({ resumes })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <MatchingStep
            jobDescription={data.jobDescription}
            resumes={data.resumes}
            matches={data.matches}
            onUpdate={(matches) => updateData({ matches })}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* AI Recruitment Themed Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background to-muted">
        {/* AI Neural Network Pattern */}
        <div className="absolute inset-0">
          {/* Subtle dot grid pattern representing AI neural networks */}
          <div className="absolute inset-0 opacity-30" style={{ 
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1) 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, hsl(var(--primary) / 0.1) 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
          
          {/* Floating AI-themed elements */}
          <div className="absolute top-16 left-16 w-4 h-4 bg-primary/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-24 w-3 h-3 bg-primary/15 rounded-full animate-[float_4s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-32 left-24 w-2 h-2 bg-primary/25 rounded-full animate-[float_6s_ease-in-out_infinite_reverse]"></div>
          <div className="absolute bottom-16 right-16 w-3 h-3 bg-primary/20 rounded-full animate-pulse"></div>
          
          {/* Connecting lines pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="neural-lines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M20,20 L40,60 M60,40 L80,80 M40,20 L60,40" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-lines)" />
          </svg>
          
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/10"></div>
        </div>
        
        {/* Header Content with 85% width consistency */}
        <div className="relative w-full px-8 py-20">
          <div className="mx-auto" style={{ width: '85%' }}>
            <div className="text-center">
              <div className="mb-6 flex items-center justify-center gap-3">
                {/* AI Brain Icon */}
                <div className="relative">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  <span className="typewriter-container">
                    <span className="typewriter-text">Recruitment AI Agent</span>
                  </span>
                </h1>
              </div>
              
              <p className="text-xl text-muted-foreground animate-fade-in-up opacity-0 max-w-2xl mx-auto mb-4" style={{ animationDelay: '3.5s', animationFillMode: 'forwards' }}>
                Streamline your hiring process with AI-powered candidate matching
              </p>
              
              {/* AI Features badges */}
              <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up opacity-0" style={{ animationDelay: '4s', animationFillMode: 'forwards' }}>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                  AI-Powered
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                  Smart Matching
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                  Automated Screening
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="w-full px-8 py-12">
        <div className="mx-auto" style={{ width: '85%' }}>
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`step-indicator ${
                      currentStep === step.id
                        ? 'active animate-pulse-glow'
                        : currentStep > step.id
                        ? 'completed'
                        : 'inactive'
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Step ${step.id}: ${step.title}`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center max-w-32">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                    currentStep > step.id ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card className="p-8 shadow-lg border-0 bg-card animate-fade-in-up">
            {renderStepContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};