# Recruit Genius Hub - AI Recruitment Platform

A React-based recruitment platform with AI-powered job description processing, resume analysis, and candidate matching.

## Features

- **Job Description Processing**: Upload PDF/DOC/DOCX or generate with AI
- **Resume Analysis**: Upload up to 10 candidate resumes
- **AI Matching**: Intelligent candidate-resume matching with scoring
- **Candidate Management**: Accept/reject workflow with email templates

## Tech Stack

- React 18 + TypeScript
- shadcn/ui + Tailwind CSS
- Vite
- Fetch API for backend integration

## Prerequisites

- Node.js (v16+)
- Backend API running on `http://localhost:8000`

## Quick Start

```bash
# Clone repository
git clone git@github.com:MihirSavjani/recuitment.ai.fe.git
cd recuitment.ai.fe

# Install dependencies
npm install

# Start development server
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:8080` or next available port).

## Testing Files

For testing the application, you can use the sample files provided in the root directory:

### Job Descriptions (`Jds And Resumes/jds/`)
- `Python AI Developer.doc` - AI Developer role
- `Full Stack Developer JD.docx` - Full Stack position
- `sample jd.pdf` - Sample job description
- `HR JD.pdf` - HR role description

### Resumes (`Jds And Resumes/resumes/`)
- `deep m.pdf` - Deep M's resume
- `kartik.pdf` - Kartik's resume
- `QA Manual Tester - Template 6.pdf` - QA tester resume
- `Ryan_resume.pdf` - Ryan's resume
- `Mihir_Savjani_Resume.pdf` - Mihir's resume

These files can be used to test all features including file upload, AI processing, and candidate matching.

## API Endpoints

The application requires these backend endpoints:

- `POST /api/v1/job-description/process` - Process uploaded job descriptions
- `POST /api/v1/job-description/generate` - Generate job descriptions with AI
- `POST /api/v1/match-and-score` - Analyze candidate-resume matches

## API Documentation

View the complete API documentation using FastAPI's built-in Swagger UI:

```bash
# Start your FastAPI backend server, then visit:
http://localhost:8000/docs
```

## Usage

1. **Job Description**: Upload file, generate with AI, or write manually
2. **Resume Upload**: Add up to 10 candidate resumes
3. **Analysis**: Review AI-generated match scores and candidate rankings
4. **Actions**: Accept or reject candidates with email templates

## Build

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── steps/              # Step components
│   └── RecruitmentFlow.tsx # Main flow
└── lib/api.ts             # API functions
```

---

Built with React, TypeScript, and AI recruitment technology.
