import React, { useState, useRef } from 'react';
import { FileText, FileUp, Loader2, AlertTriangle } from 'lucide-react';

export default function PdfUploader({ onFileProcessed, isExtracting }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // ... (keep the extractTextFromPDF and handleFiles logic exactly the same) ...
    const extractTextFromPDF = async (fileObj) => {
        try {
            if (!window.pdfjsLib) throw new Error("PDF.js loading...");
            const arrayBuffer = await fileObj.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map(item => item.str).join(" ") + " ";
            }
            return fullText.trim();
        } catch (err) {
            throw new Error("Failed to parse PDF data.");
        }
    };

    const handleFiles = async (selectedFiles) => {
        setError(null);
        const selectedFile = selectedFiles[0];
        if (!selectedFile) return;
        if (selectedFile.type !== "application/pdf") {
            setError("ERR: INVALID_FORMAT. PDF REQUIRED.");
            return;
        }
        setFile(selectedFile);
        try {
            const extractedText = await extractTextFromPDF(selectedFile);
            onFileProcessed(selectedFile.name, extractedText);
        } catch (err) {
            setError(err.message);
            setFile(null);
        }
    };

    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-['DotGothic16'] uppercase tracking-widest text-black">Candidate_Data (PDF)</label>

            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative w-full h-48 border-2 border-dotted rounded-none flex flex-col items-center justify-center cursor-pointer transition-none ${isDragging
                        ? 'border-[#EA2845] bg-[#EA2845] text-white'
                        : 'border-black bg-white hover:border-[#EA2845] text-black'
                    }`}
            >
                <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={(e) => handleFiles(e.target.files)} />

                {isExtracting ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className={`w-8 h-8 animate-spin ${isDragging ? 'text-white' : 'text-[#EA2845]'}`} />
                        <span className="text-sm font-['Space_Mono'] tracking-widest uppercase">PROCESSING...</span>
                    </div>
                ) : file ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 flex items-center justify-center border ${isDragging ? 'border-white' : 'border-black'}`}>
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-center font-['Space_Mono']">
                            <p className="text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs mt-1 uppercase opacity-70">REPLACE_FILE</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center border border-black">
                            <FileUp className="w-6 h-6" />
                        </div>
                        <div className="text-center font-['Space_Mono']">
                            <p className="text-sm uppercase font-bold">UPLOAD_OR_DRAG</p>
                            <p className="text-xs mt-1 uppercase opacity-70">PDF_ONLY</p>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-xs font-['Space_Mono'] text-[#EA2845] mt-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {error}</p>}
        </div>
    );
}