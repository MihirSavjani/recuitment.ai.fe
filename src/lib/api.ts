const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface JobDescriptionProcessResponse {
  formatted_text: string;
  processing_time: number;
}

export interface JobDescriptionGenerateRequest {
  job_title: string;
  experience: string;
  company: string;
  job_type: string;
  must_have_skills: string;
  industry: string;
  location: string;
}

export interface JobDescriptionGenerateResponse {
  formatted_text: string;
  processing_time: number;
}

export interface MatchAndScoreRequest {
  job_description: string;
  resumes: File[];
}

export interface CandidateData {
  candidate_name: string;
  resume_name: string;
  missing_skills: string[];
  pros: string[];
  cons: string[];
}

export interface CandidateRanking {
  candidate_uuid: string;
  candidate_name: string;
  match_score: number;
  rank: number;
  summary: string;
}

export interface Analytics {
  candidates_analyzed: number;
  average_match_score: number;
  top_match_score: number;
  best_candidate: string;
  best_candidate_reason: string;
  candidate_rankings: CandidateRanking[];
}

export interface MatchAndScoreResponse {
  job_description: string;
  candidates_data: Record<string, CandidateData>;
  analytics: Analytics;
}

export interface ApiError {
  message: string;
  status?: number;
}

export const processJobDescription = async (file: File): Promise<JobDescriptionProcessResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/job-description/process`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: JobDescriptionProcessResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing job description:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to process job description file'
    );
  }
};

export const generateJobDescription = async (request: JobDescriptionGenerateRequest): Promise<JobDescriptionGenerateResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/job-description/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: JobDescriptionGenerateResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating job description:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to generate job description'
    );
  }
};

export const matchAndScore = async (request: MatchAndScoreRequest): Promise<MatchAndScoreResponse> => {
  try {
    const formData = new FormData();
    formData.append('job_description', request.job_description);
    
    request.resumes.forEach((resume) => {
      formData.append('resumes', resume);
    });

    const response = await fetch(`${API_BASE_URL}/match-and-score`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: MatchAndScoreResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error matching and scoring candidates:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to match and score candidates'
    );
  }
}; 