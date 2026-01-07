import React from 'react';
import { Zap, AlertCircle } from 'lucide-react';

interface IntensityMeterProps {
    intensity: number; // 0 to 5
}

export const IntensityMeter: React.FC<IntensityMeterProps> = ({ intensity }) => {
    const percentage = Math.min((intensity / 5) * 100, 100);

    const getColorScheme = (val: number) => {
        if (val <= 1.5) {
            return {
                gradient: 'from-emerald-400 to-teal-500',
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                label: 'Stable',
                glow: 'shadow-emerald-200'
            };
        }
        if (val <= 2.5) {
            return {
                gradient: 'from-amber-400 to-orange-500',
                bg: 'bg-amber-50',
                text: 'text-amber-600',
                label: 'Agitated',
                glow: 'shadow-amber-200'
            };
        }
        if (val <= 3.8) {
            return {
                gradient: 'from-orange-500 to-red-500',
                bg: 'bg-orange-50',
                text: 'text-orange-600',
                label: 'Strained',
                glow: 'shadow-orange-200'
            };
        }
        return {
            gradient: 'from-red-600 to-rose-800',
            bg: 'bg-red-50',
            text: 'text-red-600',
            label: 'Critical',
            glow: 'shadow-red-200'
        };
    };

    const colors = getColorScheme(intensity);

    // Animation for pulse effect
    const pulseClass = intensity > 3.5 ? 'animate-pulse' : '';

    return (
        <div className="flex flex-col justify-between h-full px-4 py-2">
            {/* Top Section - Value & Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 ${colors.bg} rounded-xl border border-current/20 ${pulseClass}`}>
                        {intensity > 3.5 ? (
                            <AlertCircle size={20} className={colors.text} />
                        ) : (
                            <Zap size={20} className={colors.text} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-4xl font-black ${colors.text}`}>
                                {intensity.toFixed(1)}
                            </span>
                            <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold ${colors.text} tracking-widest`}>
                            {colors.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Vertical Bars Visualization */}
            <div className="flex items-end justify-between gap-1.5 h-24 mb-4">
                {[1, 2, 3, 4, 5].map((level) => {
                    const isActive = intensity >= level;
                    const barHeight = level * 20; // 20%, 40%, 60%, 80%, 100%

                    return (
                        <div
                            key={level}
                            className={`flex-1 rounded-t-lg transition-all duration-500 ease-out relative overflow-hidden ${isActive
                                ? `bg-gradient-to-t ${colors.gradient} ${colors.glow} shadow-md`
                                : 'bg-slate-100'
                                }`}
                            style={{
                                height: `${barHeight}%`,
                                transform: isActive ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/30 animate-shimmer" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${colors.gradient} relative`}
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Animated Shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                            style={{ backgroundSize: '200% 100%' }}
                        />
                    </div>
                </div>

                {/* Labels */}
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    <span className="text-emerald-500">Calm</span>
                    <span className="text-amber-500">Moderate</span>
                    <span className="text-red-500">Critical</span>
                </div>
            </div>
        </div>
    );
};

