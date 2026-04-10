import React from 'react';
import GaugeChart from './GaugeChart';

export default function ResultsDashboard({ results }) {
    if (!results) return null;

    const { score, matched_skills, missing_skills, summary, improvements } = results;

    return (
        <div className="mt-12 animate-in fade-in duration-300">
            <h2 className="text-2xl text-black font-['DotGothic16'] mb-6 uppercase tracking-widest border-b border-black pb-2">
                SYSTEM.OUTPUT //
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-black mb-8">
                <div className="col-span-1 bg-white border-r border-b border-black p-8 flex items-center justify-center">
                    <GaugeChart score={score} />
                </div>

                <div className="col-span-1 md:col-span-2 bg-white border-r border-b border-black p-6 flex flex-col justify-center">
                    <h3 className="text-sm text-black font-['DotGothic16'] mb-4 uppercase tracking-widest">{">>"} SUMMARY_ANALYSIS</h3>
                    <p className="text-sm text-black font-['Space_Mono'] leading-relaxed uppercase">{summary}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-black mb-8">
                <div className="bg-white border-r border-b border-black p-6">
                    <h3 className="text-sm text-black font-['DotGothic16'] mb-6 uppercase tracking-widest">{">>"} DETECTED_SKILLS</h3>
                    <div className="flex flex-wrap gap-2">
                        {matched_skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white text-black border border-black font-['DotGothic16'] text-sm uppercase">
                                {skill}
                            </span>
                        ))}
                        {matched_skills.length === 0 && <span className="text-sm font-['Space_Mono'] uppercase">NULL</span>}
                    </div>
                </div>

                <div className="bg-white border-r border-b border-black p-6">
                    <h3 className="text-sm text-[#EA2845] font-['DotGothic16'] mb-6 uppercase tracking-widest">{">>"} MISSING_PARAMETERS</h3>
                    <div className="flex flex-wrap gap-2">
                        {missing_skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white text-[#EA2845] border border-[#EA2845] font-['DotGothic16'] text-sm uppercase">
                                {skill}
                            </span>
                        ))}
                        {missing_skills.length === 0 && <span className="text-sm font-['Space_Mono'] uppercase">NULL</span>}
                    </div>
                </div>
            </div>

            <div className="bg-black border border-black p-6 mb-12">
                <h3 className="text-sm text-white font-['DotGothic16'] mb-6 uppercase tracking-widest">{">>"} REQUIRED_ACTIONS</h3>
                <ul className="space-y-4">
                    {improvements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-sm text-white font-['Space_Mono']">
                            <span className="text-[#EA2845] font-bold">[{idx + 1}]</span>
                            <span className="uppercase">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}