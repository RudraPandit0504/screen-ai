import React from 'react';

export default function JobDescriptionInput({ value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-['DotGothic16'] uppercase tracking-widest text-black">Target_Job_Description</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="> INPUT JOB REQUIREMENTS HERE_"
                className="w-full h-48 p-4 border border-black bg-white text-black 
                   focus:border-[#EA2845] focus:ring-1 focus:ring-[#EA2845] outline-none transition-none 
                   resize-none font-['Space_Mono'] text-sm rounded-none"
            />
        </div>
    );
}