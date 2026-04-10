import React from 'react';
import { Briefcase } from 'lucide-react';

export default function Header() {
    return (
        <header className="border-b border-black bg-white sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-['DotGothic16'] text-black tracking-widest text-xl uppercase">Screen_AI</span>
                </div>
            </div>
        </header>
    );
}