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

    // Determine color based on score - strictly using the 4-color palette
    const getColor = (s: number) => {
        if (s > 0) return 'text-brand-primary';    // Positive/Normal
        if (s < 0) return 'text-brand-dark';       // Negative/Critical
        return 'text-brand-medium';              // Neutral
    };

    const getBgColor = (s: number) => {
        if (s > 0) return 'from-brand-medium to-brand-primary';
        if (s < 0) return 'from-brand-primary to-brand-dark';
        return 'from-brand-light to-brand-medium';
    };

    const getIcon = (_l: string, s: number) => {
        if (s > 0.5) return '✨';
        if (s > 0) return '😊';
        if (s < -0.5) return '⚠️';
        if (s < 0) return '😔';
        return '😐';
    };

    const getGradientStops = (s: number) => {
        if (s > 0) return { start: '#7BA4D0', end: '#2E5E99' }; // medium to primary
        if (s < 0) return { start: '#2E5E99', end: '#0D2440' }; // primary to dark
        return { start: '#E7F0FA', end: '#7BA4D0' };             // light to medium
    };

    const stops = getGradientStops(score);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-brand-light h-full flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-2 left-6 flex items-center gap-2">
                <div className="p-1.5 bg-brand-light rounded-lg">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 2v20M2 12h20" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium">Sentiment</span>
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
                        className="text-brand-light"
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
                    <span className="text-4xl font-black text-brand-dark leading-none">
                        {Math.round(percentage)}
                        <span className="text-sm font-bold text-brand-medium">%</span>
                    </span>
                    <div className="mt-2 flex items-center gap-1.5 bg-brand-light px-3 py-1 rounded-full border border-brand-medium/20">
                        <span className="text-sm">{getIcon(label, score)}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${getColor(score)}`}>
                            {label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 w-full">
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-medium">Tone Spectrum</span>
                    <span className="text-[10px] font-bold text-brand-dark">Score: {score.toFixed(2)}</span>
                </div>
                <div className="relative h-2 w-full bg-brand-light rounded-full overflow-hidden">
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
                    <span className="text-[8px] font-black uppercase text-brand-dark tracking-tighter">Critical</span>
                    <span className="text-[8px] font-black uppercase text-brand-medium tracking-tighter">Neutral</span>
                    <span className="text-[8px] font-black uppercase text-brand-primary tracking-tighter">Normal</span>
                </div>
            </div>
        </div>
    );
};
