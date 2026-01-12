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
                gradient: 'from-brand-light to-brand-medium',
                bg: 'bg-brand-light',
                text: 'text-brand-primary',
                label: 'Stable',
                glow: 'shadow-brand-light'
            };
        }
        if (val <= 3.0) {
            return {
                gradient: 'from-brand-medium to-brand-primary',
                bg: 'bg-brand-light/50',
                text: 'text-brand-primary',
                label: 'Monitoring',
                glow: 'shadow-brand-medium/50'
            };
        }
        return {
            gradient: 'from-brand-primary to-brand-dark',
            bg: 'bg-brand-dark/10',
            text: 'text-brand-dark',
            label: 'Critical',
            glow: 'shadow-brand-dark/30'
        };
    };

    const colors = getColorScheme(intensity);

    // Animation for pulse effect
    const pulseClass = intensity > 3.5 ? 'animate-pulse' : '';

    return (
        <div className="flex flex-col justify-between h-full px-4 py-2 font-sans">
            {/* Top Section - Value & Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 ${colors.bg} rounded-xl border border-brand-medium/20 ${pulseClass}`}>
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
                            <span className="text-sm font-bold text-brand-medium">/ 5.0</span>
                        </div>
                        <span className={`text-[10px] uppercase font-black ${colors.text} tracking-widest`}>
                            {colors.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Vertical Bars Visualization */}
            <div className="flex items-end justify-between gap-1.5 h-24 mb-4">
                {[1, 2, 3, 4, 5].map((level) => {
                    const isActive = (intensity * 1) >= (level - 0.5); // Smoother active logic
                    const barHeight = level * 20; // 20%, 40%, 60%, 80%, 100%

                    return (
                        <div
                            key={level}
                            className={`flex-1 rounded-t-lg transition-all duration-500 ease-out relative overflow-hidden ${isActive
                                ? `bg-gradient-to-t ${colors.gradient} ${colors.glow} shadow-md`
                                : 'bg-brand-light/50'
                                }`}
                            style={{
                                height: `${barHeight}%`,
                                transform: isActive ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20 animate-shimmer" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="h-3 bg-brand-light rounded-full overflow-hidden relative shadow-inner border border-brand-medium/10">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${colors.gradient} relative`}
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Animated Shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                            style={{ backgroundSize: '200% 100%' }}
                        />
                    </div>
                </div>

                {/* Labels */}
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest px-1">
                    <span className="text-brand-medium">Stable</span>
                    <span className="text-brand-primary">Active</span>
                    <span className="text-brand-dark">Critical</span>
                </div>
            </div>
        </div>
    );
};
