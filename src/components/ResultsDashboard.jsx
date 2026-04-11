import React from 'react';
import GaugeChart from './GaugeChart';

export default function ResultsDashboard({ results }) {
    if (!results) return null;

    const {
        score = 0,
        score_breakdown = {},
        matched_skills = [],
        missing_skills = [],
        experience_match,
        seniority_verdict,
        red_flags = [],
        summary,
        improvements = [],
        hiring_recommendation,
        resumeId
    } = results;

    const breakdownItems = [
        ['Skills Match', score_breakdown.skills_match, 40],
        ['Experience Relevance', score_breakdown.experience_relevance, 30],
        ['Seniority Alignment', score_breakdown.seniority_alignment, 15],
        ['Achievements Quality', score_breakdown.achievements_quality, 15]
    ];

    const formatLabel = (value) => String(value || 'n/a').replaceAll('_', ' ').toUpperCase();

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
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border border-black p-3">
                            <p className="text-[11px] font-['DotGothic16'] uppercase tracking-widest mb-2">Experience Match</p>
                            <p className="text-sm font-['Space_Mono'] uppercase">{formatLabel(experience_match)}</p>
                        </div>
                        <div className="border border-black p-3">
                            <p className="text-[11px] font-['DotGothic16'] uppercase tracking-widest mb-2">Seniority Verdict</p>
                            <p className="text-sm font-['Space_Mono'] uppercase">{formatLabel(seniority_verdict)}</p>
                        </div>
                        <div className="border border-black p-3">
                            <p className="text-[11px] font-['DotGothic16'] uppercase tracking-widest mb-2">Hiring Recommendation</p>
                            <p className="text-sm font-['Space_Mono'] uppercase">{formatLabel(hiring_recommendation)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-black mb-8">
                <div className="bg-white border-r border-b border-black p-6">
                    <h3 className="text-sm text-black font-['DotGothic16'] mb-6 uppercase tracking-widest">{">>"} DETECTED_SKILLS</h3>
                    <div className="space-y-4">
                        {matched_skills.map((item, idx) => (
                            <div key={`${item.skill}-${idx}`} className="border border-black p-4">
                                <p className="font-['DotGothic16'] text-sm uppercase mb-2">{item.skill}</p>
                                <p className="text-sm font-['Space_Mono'] leading-relaxed uppercase">{item.evidence}</p>
                            </div>
                        ))}
                        {matched_skills.length === 0 && <span className="text-sm font-['Space_Mono'] uppercase">Null</span>}
                    </div>
                </div>

                <div className="bg-white border-r border-b border-black p-6">
                    <h3 className="text-sm text-[#EA2845] font-['DotGothic16'] mb-6 uppercase tracking-widest">{">>"} MISSING_PARAMETERS</h3>
                    <div className="space-y-4">
                        {missing_skills.map((item, idx) => (
                            <div key={`${item.skill}-${idx}`} className="border border-[#EA2845] p-4">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <p className="font-['DotGothic16'] text-sm uppercase text-[#EA2845]">{item.skill}</p>
                                    <span className="text-[11px] border border-[#EA2845] px-2 py-1 font-['DotGothic16'] uppercase">
                                        {item.criticality}
                                    </span>
                                </div>
                                <p className="text-sm font-['Space_Mono'] leading-relaxed uppercase text-[#EA2845]">{item.impact}</p>
                            </div>
                        ))}
                        {missing_skills.length === 0 && <span className="text-sm font-['Space_Mono'] uppercase">Null</span>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-black mb-8">
                <div className="bg-white border-r border-b border-black p-6">
                    <h3 className="text-sm text-black font-['DotGothic16'] mb-6 uppercase tracking-widest">{">>"} SCORE_BREAKDOWN</h3>
                    <div className="space-y-4">
                        {breakdownItems.map(([label, value, max]) => (
                            <div key={label}>
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <span className="text-sm font-['DotGothic16'] uppercase">{label}</span>
                                    <span className="text-sm font-['Space_Mono'] uppercase">{value ?? 0}/{max}</span>
                                </div>
                                <div className="h-3 border border-black">
                                    <div
                                        className="h-full bg-black"
                                        style={{ width: `${Math.max(0, Math.min(100, ((value ?? 0) / max) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border-r border-b border-black p-6">
                    <h3 className="text-sm text-[#EA2845] font-['DotGothic16'] mb-6 uppercase tracking-widest">{">>"} RED_FLAGS</h3>
                    <ul className="space-y-4">
                        {red_flags.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-4 text-sm text-[#EA2845] font-['Space_Mono']">
                                <span className="font-bold">[{idx + 1}]</span>
                                <span className="uppercase">{item}</span>
                            </li>
                        ))}
                        {red_flags.length === 0 && (
                            <li className="text-sm font-['Space_Mono'] uppercase text-black">No explicit red flags returned.</li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="bg-black border border-black p-6 mb-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h3 className="text-sm text-white font-['DotGothic16'] uppercase tracking-widest">{">>"} REQUIRED_ACTIONS</h3>
                    {resumeId && (
                        <span className="text-xs text-white font-['Space_Mono'] uppercase">Resume ID: {resumeId}</span>
                    )}
                </div>
                <ul className="space-y-4">
                    {improvements.map((item, idx) => (
                        <li key={idx} className="border border-white/30 p-4 text-sm text-white font-['Space_Mono']">
                            <div className="flex items-center justify-between gap-4 mb-3">
                                <span className="text-[#EA2845] font-bold">[{idx + 1}]</span>
                                <span className="text-[11px] border border-[#EA2845] px-2 py-1 font-['DotGothic16'] uppercase text-[#EA2845]">
                                    {item.priority}
                                </span>
                            </div>
                            <p className="uppercase">{item.action}</p>
                        </li>
                    ))}
                    {improvements.length === 0 && (
                        <li className="text-sm text-white font-['Space_Mono'] uppercase">No improvement actions returned.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
