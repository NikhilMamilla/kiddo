import React from 'react';

interface SentimentGaugeProps {
    sentiment?: {
        score: number;
        label: string;
    };
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({ sentiment }) => {
    const score = sentiment?.score ?? 0;
    const label = sentiment?.label ?? 'NEUTRAL';

    // Convert score (-1 to 1) to percentage (0 to 100)
    const percentage = ((score + 1) / 2) * 100;

    // Determine color based on score
    const getColor = (s: number) => {
        if (s > 0.5) return 'text-emerald-600'; // Very Positive
        if (s > 0) return 'text-emerald-400';    // Slightly Positive
        if (s < 0) return 'text-red-600';       // All Negative (True Red)
        return 'text-indigo-400';              // Neutral
    };

    const getBgColor = (s: number) => {
        if (s > 0.5) return 'from-emerald-500 to-teal-600';
        if (s > 0) return 'from-emerald-300 to-teal-400';
        if (s < 0) return 'from-red-500 to-red-700';
        return 'from-slate-400 to-indigo-500';
    };

    const getIcon = (_l: string, s: number) => {
        if (s > 0.5) return '✨';
        if (s > 0) return '😊';
        if (s < -0.5) return '🚨';
        if (s < 0) return '😔';
        return '😐';
    };

    const getGradientStops = (s: number) => {
        if (s > 0.5) return { start: '#10b981', end: '#059669' }; // emerald-500 to teal-600
        if (s > 0) return { start: '#6ee7b7', end: '#2dd4bf' };   // emerald-300 to teal-400
        if (s < 0) return { start: '#ef4444', end: '#b91c1c' };   // red-500 to red-700
        return { start: '#94a3b8', end: '#6366f1' };             // slate-400 to indigo-500
    };

    const stops = getGradientStops(score);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-indigo-50 h-full flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-2 left-6 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 2v20M2 12h20" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sentiment</span>
            </div>

            <div className="relative w-40 h-40 mt-4">
                {/* Background Ring */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                    />
                    {/* Progress Ring */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#sentimentGradient)"
                        strokeWidth="10"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * percentage) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={stops.start} />
                            <stop offset="100%" stopColor={stops.end} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-black text-slate-900 leading-none">
                        {Math.round(percentage)}
                        <span className="text-sm font-bold text-slate-400">%</span>
                    </span>
                    <div className="mt-2 flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        <span className="text-sm">{getIcon(label, score)}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${getColor(score)}`}>
                            {label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 w-full">
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tone Spectrum</span>
                    <span className="text-[10px] font-bold text-slate-500">Score: {score.toFixed(2)}</span>
                </div>
                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`absolute top-0 bottom-0 left-1/2 transition-all duration-700 bg-gradient-to-r ${getBgColor(score)}`}
                        style={{
                            left: score < 0 ? `${50 + score * 50}%` : '50%',
                            right: score > 0 ? `${50 - score * 50}%` : '50%'
                        }}
                    />
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white z-10" />
                </div>
                <div className="flex justify-between mt-1 px-1">
                    <span className="text-[8px] font-black uppercase text-rose-400 tracking-tighter">Negative</span>
                    <span className="text-[8px] font-black uppercase text-slate-300 tracking-tighter">Neutral</span>
                    <span className="text-[8px] font-black uppercase text-emerald-400 tracking-tighter">Positive</span>
                </div>
            </div>
        </div>
    );
};
