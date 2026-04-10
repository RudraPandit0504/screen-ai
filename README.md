# Screen AI: AI Resume Screener

A full-stack AI-powered resume screening app that compares a candidate resume against a job description and returns an ATS-style match score, matched skills, missing skills, summary feedback, and actionable improvement suggestions.

The app extracts text from uploaded PDF resumes in the browser, then sends the extracted resume text plus the job description to a hosted screening API for analysis.

This project uses AWS for hosting and serverless backend infrastructure, and Groq with the `llama-3.1-8b-instant` model for resume analysis.

## Overview

Screen AI is an ATS-style screening tool built to evaluate how well a resume matches a given job description. Users paste a job description, upload a resume PDF, and receive a compatibility score along with strengths, missing skills, and recommended next steps.

The frontend is hosted as a static React app, while the backend runs as a serverless API that securely calls Groq without exposing the API key in the browser.

## Preview

### Input Screen

![Input screen](./public/screenshots/1.png)

### Results Screen

![Results screen](./public/screenshots/2.png)

## Architecture

This project follows a serverless architecture to stay low-cost on AWS free tier while remaining scalable.

### Frontend

- React + Vite single-page app
- Hosted as a static website on Amazon S3
- Extracts resume text in the browser using PDF.js
- Sends job description and resume text to the backend API

### API Layer

- Amazon API Gateway exposes the public endpoint
- Handles request routing and CORS between frontend and backend
- Can be used to apply throttling and rate limits

### Backend

- Python logic deployed on AWS Lambda
- Stores the Groq API key securely on the server side
- Calls Groq with the `llama-3.1-8b-instant` model to generate screening results

### Security and Access

- AWS IAM manages permissions for S3 access and service roles
- Secrets stay in the backend instead of the browser

## Features

- Paste a target job description into a dedicated input panel
- Upload or drag-and-drop a PDF resume
- Extract resume text client-side with PDF.js
- Send the job description and parsed resume text to a hosted screening endpoint
- Display:
  - overall match percentage
  - matched skills
  - missing skills
  - analysis summary
  - recommended improvements
- Show clear error states for missing input, bad file types, PDF parsing failures, and API failures

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4 via `@tailwindcss/vite`
- Lucide React icons
- PDF.js loaded from CDN at runtime
- Amazon S3 for static frontend hosting
- AWS Lambda for backend processing
- Amazon API Gateway for API routing and CORS handling
- AWS IAM for permissions and access control
- Groq API with `llama-3.1-8b-instant`

## How It Works

1. The user pastes a job description.
2. The user uploads a PDF resume.
3. The app reads the PDF in the browser and extracts plain text from every page.
4. The app sends this payload to the screening API:

```json
{
  "jobDescription": "string",
  "resumeText": "string"
}
```

5. The API is expected to return a JSON response shaped like:

```json
{
  "score": 78,
  "matched_skills": ["react", "javascript"],
  "missing_skills": ["aws", "docker"],
  "experience_match": "strong",
  "summary": "Concise analysis of the resume fit.",
  "improvements": [
    "Add measurable impact to recent projects.",
    "Highlight cloud experience more clearly."
  ],
  "resumeId": "generated-uuid"
}
```

## API Endpoint

The frontend currently posts results to:

```txt
https://byka9fvisi.execute-api.ap-south-1.amazonaws.com/prod/screen
```

This value is hardcoded in [`src/App.jsx`](./src/App.jsx). If you want to point the app at another backend, update the `API_URL` constant there.

The backend implementation lives separately from this frontend project. The Lambda handler is maintained in a `lambda_function.py` file and deployed to AWS Lambda.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

## Project Structure

```txt
ai-resume-screener/
├── public/
│   └── screenshots/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── GaugeChart.jsx
│   │   ├── Header.jsx
│   │   ├── JobDescriptionInput.jsx
│   │   ├── PdfUploader.jsx
│   │   └── ResultsDashboard.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── lambda_function.py
└── vite.config.js
```

## Important Notes

- Resume parsing happens in the browser using PDF.js loaded from a CDN.
- Only PDF files are accepted by the uploader.
- The app depends on the external screening API being available and returning the expected JSON shape.
- There is currently no environment-variable based configuration for the API URL.
- The Groq API key is kept server-side in the Lambda backend and is not exposed in the frontend.

## Known Limitations

- Complex PDF layouts may extract imperfectly because the app collects text layer content page by page.
- If the hosted API changes its response format, the UI will break unless the frontend is updated too.
- The backend is hosted on AWS free-tier infrastructure, so availability and throughput may be limited.

## Backend Notes

- Backend file: `lambda_function.py`
- Model used: `Groq API with llama-3.1-8b-instant`
- Deployment target: AWS Lambda behind Amazon API Gateway
- Groq API key is read from the `GROQ_API_KEY` environment variable
- Lambda returns CORS headers for `OPTIONS,POST`
