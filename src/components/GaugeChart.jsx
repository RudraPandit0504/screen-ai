import React, { useState, useEffect } from 'react';

export default function GaugeChart({ score }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        let startTime;
        const duration = 1000;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.floor(easeOutProgress * score));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [score]);

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative">
            <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r={radius} stroke="#000000" strokeWidth="8" fill="none" />
                <circle
                    cx="80" cy="80" r={radius} stroke="#EA2845" strokeWidth="12" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    strokeLinecap="square"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center mt-2">
                <span className="text-5xl text-black font-['DotGothic16'] tracking-tighter">{animatedScore}</span>
                <span className="text-xs font-['Space_Mono'] font-bold text-black uppercase tracking-widest mt-1">Match_Pct</span>
            </div>
        </div>
    );
}