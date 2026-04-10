# Screen AI: Enterprise-Grade Resume Analysis System

An automated Applicant Tracking System (ATS) designed for high-speed resume screening and matching using Large Language Models (LLMs).

## 🚀 The Architecture
This project follows a modern **Serverless Architecture** to ensure zero cost when idle and high scalability.

- **Frontend:** React.js application hosted on **Amazon S3** (Static Website Hosting).
- **API Layer:** **AWS API Gateway** acting as a secure entry point for frontend requests.
- **Backend Logic:** **AWS Lambda** (Python) handling text processing and AI orchestration.
- **AI Brain:** **Llama 3.1 8B** running on **Groq LPUs** for sub-second inference speed (~500 tokens/sec).

## 🛠️ Technical Features
- **Asynchronous Processing:** Backend logic is decoupled to handle resume parsing efficiently.
- **Secure Secret Management:** API keys are managed via AWS environment variables to prevent credential leakage.
- **JSON Structured Output:** Uses model-specific prompting to ensure consistent parsing of resume data into Matched Skills, Missing Skills, and overall Score.

## 🔒 Security & Performance
- **CORS Configuration:** API Gateway restricted to specific origins to prevent unauthorized access.
- **LPU Acceleration:** Leveraging Groq's Language Processing Units to achieve near-instant feedback for the user.
