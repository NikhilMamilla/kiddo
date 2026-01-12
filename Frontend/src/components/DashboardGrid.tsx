import React from 'react';
import type { AnalysisResponse } from '../services/analysisService';
import type { PredictionHistoryItem } from '../types/history';
import { SentimentGauge } from './charts/SentimentGauge.tsx';
import { IntensityMeter } from './charts/IntensityMeter.tsx';
import { StateProbabilityChart } from './charts/StateProbabilityChart.tsx';
import { KeywordContributionChart } from './charts/KeywordContributionChart.tsx';
import { IntensityTimeline } from './charts/IntensityTimeline.tsx';
import { QuickCopingStrategy } from './QuickCopingStrategy.tsx';
import ResourceHub from './ResourceHub';
import { Fingerprint, Brain, Target, Info, Wind, Sparkles } from 'lucide-react';

interface DashboardGridProps {
    analysisResult: AnalysisResponse | null;
    history: PredictionHistoryItem[];
    reviewMode: boolean;
    onShowCalmCircle: () => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
    analysisResult,
    history,
    reviewMode,
    onShowCalmCircle
}) => {
    if (!analysisResult) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-brand-light">
                    <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="text-brand-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">Analyzing Health Session</h3>
                    <p className="text-brand-medium max-w-xs mx-auto font-medium">Once you send a message, I'll provide real-time health and session insights here.</p>
                </div>
            </div>
        );
    }

    const {
        sentiment_analysis,
        intensity_score,
        classified_state,
        state_probabilities,
        decision_explanation
    } = analysisResult;

    const isHighDistress = (intensity_score ?? 0) > 2.5 || ['Anxiety', 'Depression', 'Critical Distress'].includes(classified_state);

    return (
        <div className="space-y-6 pb-20 lg:pb-8 animate-fade-in font-sans">
            {/* Top Row: Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SentimentGauge sentiment={sentiment_analysis} />
                <IntensityMeter intensity={intensity_score ?? 0} />
            </div>

            {/* Actionable Insights Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7">
                    <QuickCopingStrategy state={classified_state} />
                </div>

                {/* Breathing Focus Trigger */}
                <div className="xl:col-span-5">
                    <div
                        onClick={onShowCalmCircle}
                        className={`group relative overflow-hidden cursor-pointer h-full p-6 rounded-[2rem] shadow-xl border border-brand-light transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${isHighDistress
                            ? 'bg-brand-dark text-white border-brand-primary/30'
                            : 'bg-white text-brand-dark border-brand-light'
                            }`}
                    >
                        {/* Decorative Background */}
                        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-all duration-700 group-hover:scale-110 ${isHighDistress ? 'bg-brand-primary/20' : 'bg-brand-light/50'
                            }`} />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2.5 rounded-xl transition-colors ${isHighDistress ? 'bg-brand-primary/20' : 'bg-brand-light text-brand-primary'
                                    }`}>
                                    <Wind size={20} className={isHighDistress ? 'animate-pulse' : ''} />
                                </div>
                                <h3 className={`text-[10px] font-black uppercase tracking-[.2em] ${isHighDistress ? 'text-brand-light/60' : 'text-brand-medium'
                                    }`}>Self Regulation</h3>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-xl font-bold leading-tight mb-2">Breathing Guide</h4>
                                <p className={`text-xs font-bold leading-relaxed opacity-80 ${isHighDistress ? 'text-brand-light/70' : 'text-brand-medium'
                                    }`}>
                                    {isHighDistress
                                        ? "Intensity is high. Let's find your center with a 60-second guided breathing exercise."
                                        : "Enhance your focus and clarity with a quick natural breathing rhythm."}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${isHighDistress ? 'bg-white text-brand-dark' : 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                    }`}>Start Guided Session</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resources Section Container */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <ResourceHub state={classified_state} />
            </div>

            {/* Review mode sections */}
            {reviewMode && (
                <div className="space-y-6 pt-12 border-t-2 border-dashed border-brand-medium/30 animate-fade-in">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-light rounded-lg text-brand-primary shadow-sm">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium">Advanced Layers</h3>
                                <p className="text-xs font-bold text-brand-dark">Intelligence Decision Architecture</p>
                            </div>
                        </div>
                        <Fingerprint size={20} className="text-brand-medium/30" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StateProbabilityChart
                            probabilities={state_probabilities ?? {}}
                            dominantState={classified_state}
                        />
                        <KeywordContributionChart
                            contributions={decision_explanation?.keyword_contributions ?? {}}
                        />
                    </div>

                    <IntensityTimeline history={history} />

                    {/* Decision Logic Details */}
                    <div className="bg-brand-dark text-brand-light p-8 rounded-[2.5rem] shadow-2xl border border-brand-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-brand-primary/10 transition-all duration-700" />

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="p-2 bg-brand-primary/20 rounded-xl">
                                <Target className="text-brand-primary" size={20} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white tracking-[0.15em]">Neural Decision Breakdown</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 text-brand-primary text-[9px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(46,94,153,0.5)]" />
                                    Intensity Reasoning
                                </div>
                                <p className="text-brand-light/70 text-sm leading-relaxed font-bold">
                                    {decision_explanation?.intensity_reasoning || "Analyzing systemic health intensity based on current linguistic markers and typing patterns."}
                                </p>
                            </div>

                            <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 text-brand-medium text-[9px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-medium shadow-[0_0_8px_rgba(123,164,208,0.5)]" />
                                    Classification Vector
                                </div>
                                <p className="text-brand-light/70 text-sm leading-relaxed font-bold italic">
                                    {decision_explanation?.final_decision_summary || `Session classified as ${classified_state} based on prioritized keyword concentration and sentiment polarity analysis.`}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-brand-primary/10 flex items-center justify-between relative z-10 px-2">
                            <div className="flex items-center gap-3">
                                <Info className="text-brand-medium/50" size={14} />
                                <p className="text-[10px] text-brand-medium font-bold uppercase tracking-widest">
                                    Logical Certainty: {(state_probabilities?.[classified_state as keyof typeof state_probabilities] ?? 0)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardGrid;
