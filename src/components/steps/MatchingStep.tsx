import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  Mail, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Star,
  TrendingUp,
  Users,
  Award,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: string;
  name: string;
  filename: string;
  missingSkills: string[];
  remarks: string;
  matchScore: number;
  isTopCandidate?: boolean;
}

interface MatchingStepProps {
  jobDescription: string;
  resumes: File[];
  matches: Candidate[];
  onUpdate: (matches: Candidate[]) => void;
  onPrev: () => void;
}

interface ProgressRingProps {
  score: number;
  size?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ score, size = 48 }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return 'hsl(142, 71%, 45%)'; // success green
    if (score >= 60) return 'hsl(38, 92%, 50%)'; // warning yellow
    return 'hsl(0, 84%, 60%)'; // destructive red
  };

  const getBackgroundColor = (score: number) => {
    if (score >= 80) return 'hsl(142, 71%, 95%)'; // light green
    if (score >= 60) return 'hsl(38, 92%, 95%)'; // light yellow
    return 'hsl(0, 84%, 95%)'; // light red
  };

  return (
    <div className="progress-ring relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="background"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="6"
          fill="none"
          stroke={getBackgroundColor(score)}
        />
        <circle
          className="progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="6"
          fill="none"
          stroke={getColor(score)}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const MatchingStep: React.FC<MatchingStepProps> = ({
  jobDescription,
  resumes,
  matches,
  onUpdate,
  onPrev
}) => {
  const [emailDraft, setEmailDraft] = useState({ subject: '', body: '' });
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const { toast } = useToast();

  // Generate mock matches when resumes are provided
  useEffect(() => {
    if (resumes.length > 0 && matches.length === 0) {
      const mockMatches: Candidate[] = resumes.map((resume, index) => {
        const scores = [92, 78, 85, 65, 73, 88, 56, 82, 70, 75];
        const score = scores[index] || Math.floor(Math.random() * 40) + 50;
        
        const names = [
          'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Thompson', 'Jessica Liu',
          'Robert Kim', 'Amanda Foster', 'James Wilson', 'Maria Garcia', 'Christopher Brown'
        ];

        const skillSets = [
          ['React Native', 'GraphQL'],
          ['Docker', 'Kubernetes', 'AWS'],
          ['Python', 'Machine Learning'],
          ['Angular', 'RxJS', 'NgRx'],
          ['Vue.js', 'Vuex'],
          ['Node.js', 'Express'],
          ['MongoDB', 'Redis'],
          ['TypeScript', 'Jest'],
          ['PostgreSQL', 'SQL'],
          ['DevOps', 'CI/CD']
        ];

        const remarks = [
          'Strong technical background with excellent problem-solving skills',
          'Great communication skills and team collaboration experience',
          'Solid experience in full-stack development',
          'Good cultural fit with leadership potential',
          'Recent graduate with fresh perspective and enthusiasm',
          'Senior developer with mentoring experience',
          'Strong backend expertise with cloud experience',
          'Frontend specialist with UX/UI design skills',
          'Database optimization and performance tuning expert',
          'DevOps engineer with automation expertise'
        ];

        return {
          id: `candidate-${index}`,
          name: names[index] || `Candidate ${index + 1}`,
          filename: resume.name,
          missingSkills: skillSets[index] || ['Additional training needed'],
          remarks: remarks[index] || 'Promising candidate with growth potential',
          matchScore: score,
          isTopCandidate: index === 0 && score >= 85
        };
      });

      // Sort by match score
      mockMatches.sort((a, b) => b.matchScore - a.matchScore);
      mockMatches[0].isTopCandidate = true;

      onUpdate(mockMatches);
    }
  }, [resumes, matches, onUpdate]);

  const handleAction = (candidate: Candidate, action: 'accept' | 'reject') => {
    setSelectedCandidate(candidate);
    setActionType(action);
    
    const subject = action === 'accept' 
      ? `Exciting Opportunity - Next Steps in Our Hiring Process`
      : `Thank you for your interest in our position`;
    
    const body = action === 'accept'
      ? `Dear ${candidate.name},

Thank you for your interest in our position. We were impressed by your background and would like to move forward with the next steps in our hiring process.

Based on your resume and qualifications, we believe you would be a great fit for our team. We'd like to schedule a phone interview to discuss the role further and learn more about your experience.

Would you be available for a 30-minute call sometime next week? Please let me know your preferred time slots and I'll send over a calendar invite.

Looking forward to speaking with you soon!

Best regards,
[Your Name]
[Your Title]
[Company Name]`
      : `Dear ${candidate.name},

Thank you for taking the time to apply for our position and for your interest in joining our team.

After careful consideration of all applications, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We were impressed by your background and encourage you to apply for future opportunities that may be a better fit for your skills and experience.

We wish you the best of luck in your job search.

Best regards,
[Your Name]
[Your Title]
[Company Name]`;

    setEmailDraft({ subject, body });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Email content has been copied to your clipboard."
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually.",
        variant: "destructive"
      });
    }
  };

  const copyFullEmail = () => {
    const fullEmail = `Subject: ${emailDraft.subject}\n\n${emailDraft.body}`;
    copyToClipboard(fullEmail);
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Processing resumes and generating matches...</p>
      </div>
    );
  }

  const topCandidate = matches.find(match => match.isTopCandidate);
  const avgScore = Math.round(matches.reduce((sum, match) => sum + match.matchScore, 0) / matches.length);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Matching & Scoring Results</h2>
        <p className="text-muted-foreground">AI analysis complete - review your candidate matches</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{matches.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Candidates Analyzed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{avgScore}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Average Match Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{topCandidate?.matchScore || 0}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Top Match Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-center py-4 px-6 font-medium">Name</th>
                  <th className="text-center py-4 px-6 font-medium">Resume File</th>
                  <th className="text-center py-4 px-6 font-medium">Missing Skills</th>
                  <th className="text-center py-4 px-6 font-medium">Remarks</th>
                  <th className="text-center py-4 px-6 font-medium">Match Score</th>
                  <th className="text-center py-4 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((candidate) => (
                  <tr 
                    key={candidate.id} 
                    className={`border-b transition-colors hover:bg-muted/50 ${
                      candidate.isTopCandidate ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                  >
                    <td className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {candidate.isTopCandidate && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <span className="font-medium">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center">
                        <span className="text-sm text-muted-foreground truncate max-w-32 block">
                          {candidate.filename}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {candidate.missingSkills.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.missingSkills.length > 3 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            +{candidate.missingSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex justify-center items-center h-full">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View Analysis
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Candidate Analysis - {candidate.name}
                              </DialogTitle>
                              <DialogDescription>
                                Detailed pros and cons analysis for {candidate.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="flex items-center gap-3">
                                <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold ${
                                  candidate.matchScore >= 80 ? 'bg-green-100 text-green-800 border border-green-200' : 
                                  candidate.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                  {candidate.matchScore >= 80 ? '#1 Match' : 
                                   candidate.matchScore >= 60 ? '#2 Match' : '#3 Match'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Match Score: {candidate.matchScore}%
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <h3 className="font-semibold text-green-700">Pros</h3>
                                  </div>
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                      <span className="text-green-500 mt-1">✓</span>
                                      <span>Strong technical background with 5+ years of experience</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-green-500 mt-1">✓</span>
                                      <span>Excellent problem-solving and analytical skills</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-green-500 mt-1">✓</span>
                                      <span>Relevant industry experience in similar roles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-green-500 mt-1">✓</span>
                                      <span>Strong communication and teamwork abilities</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-green-500 mt-1">✓</span>
                                      <span>Proven track record of successful project delivery</span>
                                    </li>
                                  </ul>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <h3 className="font-semibold text-red-700">Cons</h3>
                                  </div>
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                      <span className="text-red-500 mt-1">✗</span>
                                      <span>Missing some advanced technical skills (React Native, GraphQL)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-red-500 mt-1">✗</span>
                                      <span>Limited leadership and mentoring experience</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-red-500 mt-1">✗</span>
                                      <span>No experience with cloud platforms (AWS, Azure)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-red-500 mt-1">✗</span>
                                      <span>Salary expectations may be above budget</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="bg-muted/30 rounded-lg p-4">
                                <h4 className="font-medium mb-2">Overall Assessment</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                        {candidate.remarks}
                      </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="relative w-12 h-12">
                          <svg width="48" height="48" className="transform -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              strokeWidth="3"
                              fill="none"
                              stroke="#f3f4f6"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              strokeWidth="3"
                              fill="none"
                              stroke={candidate.matchScore >= 80 ? '#10b981' : candidate.matchScore >= 60 ? '#f59e0b' : '#ef4444'}
                              strokeDasharray="125.6"
                              strokeDashoffset={125.6 - (candidate.matchScore / 100) * 125.6}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-900">
                              {candidate.matchScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(candidate, 'accept')}
                              className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Email Draft - Accept {selectedCandidate?.name}
                              </DialogTitle>
                              <DialogDescription>
                                Review and customize the email before sending to the candidate.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                  id="subject"
                                  value={emailDraft.subject}
                                  onChange={(e) => setEmailDraft(prev => ({ ...prev, subject: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="body">Email Body</Label>
                                <Textarea
                                  id="body"
                                  value={emailDraft.body}
                                  onChange={(e) => setEmailDraft(prev => ({ ...prev, body: e.target.value }))}
                                  rows={12}
                                  className="font-mono text-sm"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={copyFullEmail} className="flex-1">
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Email
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(candidate, 'reject')}
                              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Email Draft - Reject {selectedCandidate?.name}
                              </DialogTitle>
                              <DialogDescription>
                                Professional rejection email template for the candidate.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="subject-reject">Subject</Label>
                                <Input
                                  id="subject-reject"
                                  value={emailDraft.subject}
                                  onChange={(e) => setEmailDraft(prev => ({ ...prev, subject: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="body-reject">Email Body</Label>
                                <Textarea
                                  id="body-reject"
                                  value={emailDraft.body}
                                  onChange={(e) => setEmailDraft(prev => ({ ...prev, body: e.target.value }))}
                                  rows={12}
                                  className="font-mono text-sm"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={copyFullEmail} className="flex-1">
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Email
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          size="lg"
          className="px-8"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Resume Parsing
        </Button>
        <Button
          size="lg"
          className="px-8"
          onClick={() => {
            toast({
              title: "Process Complete",
              description: "Your recruitment analysis is ready for review!"
            });
          }}
        >
          Complete Analysis
        </Button>
      </div>
    </div>
  );
};