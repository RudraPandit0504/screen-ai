import React, { useState, useEffect } from 'react';
import { UploadCloud, Loader2, XCircle } from 'lucide-react';

// Import our newly separated components
import Header from './components/Header';
import JobDescriptionInput from './components/JobDescriptionInput';
import PdfUploader from './components/PdfUploader';
import ResultsDashboard from './components/ResultsDashboard';

const API_URL = "https://byka9fvisi.execute-api.ap-south-1.amazonaws.com/prod/screen";
const MIN_JOB_DESCRIPTION_LENGTH = 50;
const MIN_RESUME_TEXT_LENGTH = 100;

export default function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");

  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [results, setResults] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  // Load PDF.js worker dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleFileProcessed = (name, extractedText) => {
    setIsExtracting(true);
    setTimeout(() => {
      setResumeText(extractedText);
      setIsExtracting(false);
      setGlobalError(null);
    }, 600);
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setGlobalError("Both the job description and resume PDF text are required.");
      return;
    }

    if (jobDescription.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
      setGlobalError(`Job description is too short. Minimum ${MIN_JOB_DESCRIPTION_LENGTH} characters required.`);
      return;
    }

    if (resumeText.trim().length < MIN_RESUME_TEXT_LENGTH) {
      setGlobalError(`Resume text is too short. Minimum ${MIN_RESUME_TEXT_LENGTH} characters required.`);
      return;
    }

    setGlobalError(null);
    setIsAnalyzing(true);
    setResults(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDescription,
          resumeText: resumeText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Request failed with status ${response.status}.`);
      }

      setResults(data);

    } catch (error) {
      console.error("API Error:", error);
      setGlobalError(error.message || "The analysis request failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#EA2845] selection:text-white pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-12">

        {/* Stark Brutalist Header */}
        <div className="mb-12 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-['DotGothic16'] text-black mb-2 uppercase tracking-widest">
            ANALYSIS_ENGINE_
          </h1>
          <p className="text-black font-['Space_Mono'] text-sm uppercase">
            Input parameters to execute compatibility protocols.
          </p>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
          <PdfUploader onFileProcessed={handleFileProcessed} isExtracting={isExtracting} />
        </div>

        {/* Action Button & Error State */}
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription || !resumeText || isExtracting}
            className="w-full md:w-auto px-12 py-4 bg-black text-white font-['DotGothic16'] text-lg rounded-full 
                       hover:bg-[#EA2845] disabled:bg-gray-200 disabled:text-gray-400 disabled:border-transparent
                       transition-colors duration-0 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                EXECUTING...
              </>
            ) : (
              <>
                INITIATE_SCAN
                <UploadCloud className="w-5 h-5" />
              </>
            )}
          </button>

          {/* High-Contrast Error Toast */}
          {globalError && (
            <div className="mt-6 flex items-start gap-3 bg-white border-2 border-[#EA2845] text-[#EA2845] px-6 py-4 font-['Space_Mono'] text-sm max-w-lg w-full uppercase">
              <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p>ERR: {globalError}</p>
            </div>
          )}
        </div>

        {/* Results Component */}
        <ResultsDashboard results={results} />

      </main>
    </div>
  );
}
