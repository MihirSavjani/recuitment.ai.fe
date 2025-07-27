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